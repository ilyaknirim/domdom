import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import PropertyCard from '../components/PropertyCard';

const FavoritesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => api.getFavorites(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">{t('common.favorites')}</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {data.map((fav: any) => (
              <PropertyCard
                key={fav.property.id}
                property={fav.property}
                onClick={() => navigate(`/property/${fav.property.id}`)}
                isFavorite={true}
                onFavoriteToggle={() => api.removeFromFavorites(fav.property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">❤️</div>
            <p>{t('favorites.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
