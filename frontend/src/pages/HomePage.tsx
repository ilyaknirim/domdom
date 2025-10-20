import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import FilterButton from '../components/FilterButton';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Получение списка объектов
  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', searchQuery],
    queryFn: () => api.getProperties({ city: searchQuery }),
  });

  const popularCities = [
    { name: 'Тель-Авив', nameEn: 'Tel Aviv', image: '🏙️' },
    { name: 'Иерусалим', nameEn: 'Jerusalem', image: '🕌' },
    { name: 'Хайфа', nameEn: 'Haifa', image: '⛰️' },
    { name: 'Эйлат', nameEn: 'Eilat', image: '🏖️' },
    { name: 'Нетания', nameEn: 'Netanya', image: '🌊' },
    { name: 'Беер-Шева', nameEn: 'Beer Sheva', image: '🏜️' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{t('home.title')}</h1>
        <p className="text-blue-100 mb-4">{t('home.subtitle')}</p>

        {/* Search Bar */}
        <div className="flex gap-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('home.searchPlaceholder')}
          />
          <FilterButton onClick={() => navigate('/search')} />
        </div>
      </div>

      <div className="p-4">
        {/* Popular Cities */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">{t('home.popularCities')}</h2>
          <div className="grid grid-cols-3 gap-3">
            {popularCities.map((city) => (
              <button
                key={city.nameEn}
                onClick={() => {
                  setSearchQuery(city.nameEn);
                  navigate('/search', { state: { city: city.nameEn } });
                }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-2">{city.image}</div>
                <div className="text-sm font-medium text-gray-800">{city.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Properties */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">{t('home.recentProperties')}</h2>
            <button
              onClick={() => navigate('/search')}
              className="text-blue-600 text-sm font-medium"
            >
              {t('common.viewAll')} →
            </button>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">{t('common.loading')}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
              {t('errors.general')}
            </div>
          )}

          {data && (
            <div className="grid grid-cols-1 gap-4">
              {data.properties?.map((property: any) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => navigate(`/property/${property.id}`)}
                />
              ))}
            </div>
          )}

          {data && data.properties?.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>{t('search.noResults')}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
