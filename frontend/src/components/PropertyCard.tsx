import { useTranslation } from 'react-i18next';
import { MapPinIcon, HomeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface PropertyCardProps {
  property: any;
  onClick: () => void;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
}

const PropertyCard = ({ property, onClick, onFavoriteToggle, isFavorite }: PropertyCardProps) => {
  const { t } = useTranslation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getDealTypeLabel = (dealType: string) => {
    return dealType === 'SALE' ? t('property.forSale') : t('property.forRent');
  };

  const getPropertyTypeLabel = (type: string) => {
    return t(`property.${type.toLowerCase()}`);
  };

  return (
    <div className="property-card" onClick={onClick}>
      {/* Image Gallery */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <HomeIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Deal Type Badge */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          {getDealTypeLabel(property.dealType)}
        </div>

        {/* Favorite Button */}
        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <HeartIconSolid
              className={`w-6 h-6 ${isFavorite ? 'text-red-500' : 'text-gray-300'}`}
            />
          </button>
        )}

        {/* Image Count */}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-lg text-xs">
            📷 {property.images.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Type */}
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <p className="text-sm text-gray-500">{getPropertyTypeLabel(property.type)}</p>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-700 text-sm mb-3">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{property.address}, {property.city}</span>
        </div>

        {/* Features */}
        <div className="flex gap-4 text-sm text-gray-700 mb-3">
          <span>🛏️ {property.bedrooms}</span>
          <span>🚿 {property.bathrooms}</span>
          <span>📐 {property.area} м²</span>
        </div>

        {/* Price & Owner */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(property.price)} ₪
            </div>
            {property.dealType === 'RENT' && (
              <div className="text-xs text-gray-500">{t('common.perMonth')}</div>
            )}
          </div>

          {property.owner && (
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs text-gray-700">
                  {property.owner.firstName} {property.owner.lastName}
                </div>
                {property.owner.isVerified && (
                  <div className="text-xs text-green-600 flex items-center justify-end">
                    ✓ {t('profile.verified')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-xs text-gray-700 mt-3">
          <span>👁️ {property.viewCount}</span>
          <span>❤️ {property.favoriteCount}</span>
          {property._count?.reviews > 0 && (
            <span>⭐ {property.owner.rating.toFixed(1)} ({property._count.reviews})</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
