import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../utils/telegram';

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = getUserData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">{t('profile.title')}</h1>

        {/* User Info */}
        <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.first_name?.[0] || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {user?.first_name} {user?.last_name}
              </h2>
              {user?.username && (
                <p className="text-gray-600">@{user.username}</p>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => navigate('/my-properties')}
            className="w-full p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50"
          >
            <span className="font-medium">🏠 {t('profile.myProperties')}</span>
            <span>→</span>
          </button>

          <button
            onClick={() => navigate('/favorites')}
            className="w-full p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50"
          >
            <span className="font-medium">❤️ {t('profile.favorites')}</span>
            <span>→</span>
          </button>

          <button
            onClick={() => navigate('/bookings')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
          >
            <span className="font-medium">📅 {t('profile.myBookings')}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
