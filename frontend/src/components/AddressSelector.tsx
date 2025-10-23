import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useTranslation } from 'react-i18next';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface AddressSelectorProps {
  onAddressSelect: (address: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  }) => void;
  initialAddress?: string;
  className?: string;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const Map: React.FC<{
  center: google.maps.LatLngLiteral;
  zoom: number;
  onMapClick: (location: google.maps.LatLngLiteral) => void;
  marker?: google.maps.LatLngLiteral;
}> = ({ center, zoom, onMapClick, marker }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [markerInstance, setMarkerInstance] = useState<google.maps.Marker>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const location = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          onMapClick(location);
        }
      });

      setMap(newMap);
    }
  }, [ref, map, center, zoom, onMapClick]);

  useEffect(() => {
    if (map && marker) {
      if (markerInstance) {
        markerInstance.setPosition(marker);
      } else {
        const newMarker = new google.maps.Marker({
          position: marker,
          map,
          draggable: true,
        });

        newMarker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            onMapClick({
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            });
          }
        });

        setMarkerInstance(newMarker);
      }
    }
  }, [map, marker, markerInstance, onMapClick]);

  return <div ref={ref} className="w-full h-64 rounded-lg" />;
};

const AddressSelector: React.FC<AddressSelectorProps> = ({
  onAddressSelect,
  initialAddress = '',
  className = '',
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-gray-500">{t('common.loading')}</div>
        </div>;
      case Status.FAILURE:
        return <div className="w-full h-64 bg-red-50 rounded-lg flex items-center justify-center">
          <div className="text-red-500">{t('errors.mapLoadError')}</div>
        </div>;
      case Status.SUCCESS:
        return (
          <Map
            center={{ lat: 32.0853, lng: 34.7818 }} // Tel Aviv coordinates
            zoom={12}
            onMapClick={handleMapClick}
            marker={selectedLocation || undefined}
          />
        );
    }
  };

  const geocodeLatLng = useCallback(async (location: google.maps.LatLngLiteral) => {
    if (!geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }

    try {
      const response = await geocoderRef.current.geocode({ location });
      if (response.results && response.results[0]) {
        const result = response.results[0];
        const address = result.formatted_address;

        // Extract city from address components
        let city = '';
        for (const component of result.address_components) {
          if (component.types.includes('locality') || component.types.includes('administrative_area_level_1')) {
            city = component.long_name;
            break;
          }
        }

        setSelectedAddress(address);
        setSelectedCity(city);
        setSelectedLocation(location);

        onAddressSelect({
          address,
          city,
          latitude: location.lat,
          longitude: location.lng,
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  }, [onAddressSelect]);

  const geocodeAddress = useCallback(async (address: string) => {
    if (!geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }

    setIsSearching(true);
    try {
      const response = await geocoderRef.current.geocode({ address });
      if (response.results && response.results[0]) {
        const location = response.results[0].geometry.location;
        const latLng = {
          lat: location.lat(),
          lng: location.lng(),
        };
        await geocodeLatLng(latLng);
      }
    } catch (error) {
      console.error('Address geocoding error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [geocodeLatLng]);

  const handleMapClick = useCallback((location: google.maps.LatLngLiteral) => {
    geocodeLatLng(location);
  }, [geocodeLatLng]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      geocodeAddress(searchQuery.trim());
    }
  }, [searchQuery, geocodeAddress]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('property.searchAddress')}
          className="input-field pr-12"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Selected Address Display */}
      {selectedAddress && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <MapPinIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-blue-900">{selectedCity}</div>
              <div className="text-sm text-blue-700">{selectedAddress}</div>
              {selectedLocation && (
                <div className="text-xs text-blue-600 mt-1">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render} />
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600">
        {t('property.addressInstructions')}
      </div>
    </div>
  );
};

export default AddressSelector;
