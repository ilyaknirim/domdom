import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
}

const Filters = ({ isOpen, onClose, onApply, initialFilters = {} }: FiltersProps) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState(initialFilters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
    onApply({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-h-[90vh] rounded-t-3xl overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t('filters.title')}</h2>
          <button onClick={onClose} className="p-2">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium mb-3">{t('filters.propertyType')}</label>
            <div className="grid grid-cols-3 gap-2">
              {['APARTMENT', 'ROOM', 'HOUSE', 'STUDIO', 'PENTHOUSE', 'VILLA'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters({ ...filters, type: filters.type === type ? undefined : type })}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                    filters.type === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {t(`property.${type.toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Deal Type */}
          <div>
            <label className="block text-sm font-medium mb-3">{t('filters.dealType')}</label>
            <div className="grid grid-cols-2 gap-2">
              {['RENT', 'SALE'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters({ ...filters, dealType: filters.dealType === type ? undefined : type })}
                  className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                    filters.dealType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {t(`property.for${type.charAt(0) + type.slice(1).toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-3">{t('filters.priceRange')}</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder={t('common.from')}
                value={filters.minPrice || ''}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder={t('common.to')}
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Rooms */}
          <div>
            <label className="block text-sm font-medium mb-3">{t('filters.rooms')}</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setFilters({ ...filters, rooms: filters.rooms === num ? undefined : num })}
                  className={`py-3 rounded-xl font-medium transition-colors ${
                    filters.rooms === num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {num}+
                </button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium mb-3">{t('filters.area')}</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder={t('common.from')}
                value={filters.minArea || ''}
                onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder={t('common.to')}
                value={filters.maxArea || ''}
                onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-3">{t('filters.city')}</label>
            <select
              value={filters.city || ''}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="input-field"
            >
              <option value="">{t('common.all')}</option>
              <option value="Tel Aviv">Tel Aviv / תל אביב</option>
              <option value="Jerusalem">Jerusalem / ירושלים</option>
              <option value="Haifa">Haifa / חיפה</option>
              <option value="Eilat">Eilat / אילת</option>
              <option value="Netanya">Netanya / נתניה</option>
              <option value="Beer Sheva">Beer Sheva / באר שבע</option>
              <option value="Rishon LeZion">Rishon LeZion / ראשון לציון</option>
              <option value="Ashdod">Ashdod / אשדוד</option>
              <option value="Herzliya">Herzliya / הרצליה</option>
              <option value="Rehovot">Rehovot / רחובות</option>
            </select>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium mb-3">{t('property.amenities')}</label>
            <div className="grid grid-cols-2 gap-2">
              {['parking', 'elevator', 'balcony', 'airConditioner', 'furnished', 'petFriendly'].map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => {
                    const currentAmenities = filters.amenities || [];
                    const newAmenities = currentAmenities.includes(amenity)
                      ? currentAmenities.filter((a: string) => a !== amenity)
                      : [...currentAmenities, amenity];
                    setFilters({ ...filters, amenities: newAmenities });
                  }}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors text-left ${
                    filters.amenities?.includes(amenity)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {t(`amenities.${amenity}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={handleReset}
            className="btn-secondary flex-1"
          >
            {t('filters.resetFilters')}
          </button>
          <button
            onClick={handleApply}
            className="btn-primary flex-1"
          >
            {t('filters.applyFilters')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
