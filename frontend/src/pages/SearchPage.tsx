import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const SearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    city: '',
    type: '',
    dealType: '',
    minPrice: '',
    maxPrice: '',
    minRooms: '',
    maxRooms: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => api.getProperties(filters),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">{t('common.search')}</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <select
            value={filters.dealType}
            onChange={(e) => setFilters({ ...filters, dealType: e.target.value })}
            className="input-field"
          >
            <option value="">{t('filters.dealType')}</option>
            <option value="SALE">{t('property.forSale')}</option>
            <option value="RENT">{t('property.forRent')}</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="input-field"
          >
            <option value="">{t('filters.propertyType')}</option>
            <option value="APARTMENT">{t('property.apartment')}</option>
            <option value="HOUSE">{t('property.house')}</option>
            <option value="ROOM">{t('property.room')}</option>
            <option value="STUDIO">{t('property.studio')}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder={`${t('common.price')} ${t('common.from')}`}
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="input-field"
          />
          <input
            type="number"
            placeholder={`${t('common.price')} ${t('common.to')}`}
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {t('search.found')}: {data?.pagination?.total || 0}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {data?.properties?.map((property: any) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => navigate(`/property/${property.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
