import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { PlusIcon } from '@heroicons/react/24/outline';

const MyPropertiesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['myProperties'],
    queryFn: () => api.getMyProperties(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('common.myProperties')}</h1>
          <button
            onClick={() => navigate('/create-property')}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            {t('property.create')}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {data.map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => navigate(`/property/${property.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">🏠</div>
            <p className="mb-4">{t('myProperties.empty')}</p>
            <button onClick={() => navigate('/create-property')} className="btn-primary">
              {t('property.createFirst')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPropertiesPage;
