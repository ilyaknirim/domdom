import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import {
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { showMainButton, hideMainButton, hapticFeedback } from '../utils/telegram';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => api.getPropertyById(id!),
  });

  // Показываем кнопку бронирования
  useState(() => {
    if (property?.dealType === 'RENT') {
      showMainButton(t('property.bookNow'), () => {
        hapticFeedback.impact('medium');
        navigate(`/booking/${id}`);
      });
    }
    return () => hideMainButton();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return <div className="p-4">{t('errors.notFound')}</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      <div className="relative h-80">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="h-full"
        >
          {property.images?.map((image: string, index: number) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`${property.title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Top Actions */}
        <div className="absolute top-4 left-0 right-0 px-4 flex justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsFavorite(!isFavorite);
                hapticFeedback.impact('light');
              }}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
            >
              <HeartIcon
                className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
            <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
              <ShareIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Price */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold flex-1">{property.title}</h1>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(property.price)} ₪
              </div>
              {property.dealType === 'RENT' && (
                <div className="text-sm text-gray-500">{t('common.perMonth')}</div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="w-5 h-5 mr-2" />
            <span>{property.address}, {property.city}</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-2xl mb-1">🛏️</div>
            <div className="text-sm font-medium">{property.bedrooms}</div>
            <div className="text-xs text-gray-500">{t('property.bedrooms')}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-2xl mb-1">🚿</div>
            <div className="text-sm font-medium">{property.bathrooms}</div>
            <div className="text-xs text-gray-500">{t('property.bathrooms')}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-2xl mb-1">📐</div>
            <div className="text-sm font-medium">{property.area}</div>
            <div className="text-xs text-gray-500">м²</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-2xl mb-1">🏢</div>
            <div className="text-sm font-medium">{property.floor}/{property.totalFloors}</div>
            <div className="text-xs text-gray-500">{t('property.floor')}</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{t('property.description')}</h2>
          <p className="text-gray-700 leading-relaxed">{property.description}</p>
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">{t('property.amenities')}</h2>
            <div className="grid grid-cols-2 gap-3">
              {property.amenities.map((amenity: string) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <span className="text-green-500">✓</span>
                  {t(`amenities.${amenity}`)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Owner Info */}
        {property.owner && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-semibold">
                  {property.owner.firstName} {property.owner.lastName}
                </h3>
                {property.owner.isVerified && (
                  <div className="text-sm text-green-600">✓ {t('profile.verified')}</div>
                )}
              </div>
              {property.owner.rating > 0 && (
                <div className="text-right">
                  <div className="text-lg font-bold">⭐ {property.owner.rating.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">
                    {property.owner.reviewCount} {t('profile.reviews')}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(`/chat/${property.owner.id}`)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <PhoneIcon className="w-5 h-5" />
              {t('property.contactOwner')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailPage;
