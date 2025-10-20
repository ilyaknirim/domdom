import { useTranslation } from 'react-i18next';

const BookingsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">{t('common.bookings')}</h1>
      <div className="text-center py-12 text-gray-500">
        <div className="text-6xl mb-4">📅</div>
        <p>{t('bookings.empty')}</p>
      </div>
    </div>
  );
};

export default BookingsPage;
