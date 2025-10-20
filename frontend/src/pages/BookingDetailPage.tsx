import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import Calendar from '../components/Calendar';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { showMainButton, hideMainButton, hapticFeedback, showConfirm } from '../utils/telegram';

const BookingDetailPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedDates, setSelectedDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({
    checkIn: null,
    checkOut: null,
  });

  const [guestCount, setGuestCount] = useState(1);
  const [notes, setNotes] = useState('');

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => api.getPropertyById(propertyId!),
  });

  const handleDateSelect = (date: Date) => {
    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      // Начинаем новое выделение
      setSelectedDates({ checkIn: date, checkOut: null });
      hapticFeedback.selection();
    } else {
      // Завершаем выделение
      if (date > selectedDates.checkIn) {
        setSelectedDates({ ...selectedDates, checkOut: date });
        hapticFeedback.impact('light');
      } else {
        // Если выбрали дату раньше checkIn, меняем местами
        setSelectedDates({ checkIn: date, checkOut: selectedDates.checkIn });
        hapticFeedback.impact('light');
      }
    }
  };

  const calculateTotalPrice = () => {
    if (!property || !selectedDates.checkIn || !selectedDates.checkOut) return 0;

    const days = Math.ceil(
      (selectedDates.checkOut.getTime() - selectedDates.checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    const pricePerDay = property.pricePerMonth
      ? Number(property.pricePerMonth) / 30
      : Number(property.price);

    return pricePerDay * days;
  };

  const handleBooking = async () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      return;
    }

    const confirmed = await showConfirm(
      `Забронировать на ${Math.ceil((selectedDates.checkOut.getTime() - selectedDates.checkIn.getTime()) / (1000 * 60 * 60 * 24))} дней за ${calculateTotalPrice().toFixed(0)} ₪?`
    );

    if (confirmed) {
      try {
        hapticFeedback.impact('medium');
        await api.createBooking({
          propertyId: propertyId!,
          checkIn: selectedDates.checkIn.toISOString(),
          checkOut: selectedDates.checkOut.toISOString(),
          guestCount,
          notes,
        });
        hapticFeedback.notification('success');
        navigate('/bookings');
      } catch (error) {
        hapticFeedback.notification('error');
      }
    }
  };

  // Показываем кнопку бронирования когда выбраны даты
  useState(() => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      showMainButton(
        `${t('booking.confirmBooking')} - ${calculateTotalPrice().toFixed(0)} ₪`,
        handleBooking
      );
    } else {
      hideMainButton();
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
          <div>
            <h1 className="text-xl font-semibold">{t('booking.title')}</h1>
            <p className="text-sm text-gray-500">{property.title}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Calendar */}
        <div>
          <h2 className="text-lg font-semibold mb-3">{t('booking.selectDates')}</h2>
          <Calendar
            selectedDates={selectedDates}
            onDateSelect={handleDateSelect}
            blockedDates={property.blockedDates}
            minDate={new Date()}
            selectRange={true}
          />
        </div>

        {/* Guest Count */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium mb-2">{t('booking.guests')}</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold"
            >
              -
            </button>
            <span className="text-xl font-semibold">{guestCount}</span>
            <button
              onClick={() => setGuestCount(guestCount + 1)}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium mb-2">{t('booking.notes')}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('booking.notesPlaceholder')}
            className="input-field"
            rows={3}
          />
        </div>

        {/* Price Summary */}
        {selectedDates.checkIn && selectedDates.checkOut && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">{t('booking.priceSummary')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {property.pricePerMonth ? `${(Number(property.pricePerMonth) / 30).toFixed(0)} ₪` : `${property.price} ₪`} × {' '}
                  {Math.ceil((selectedDates.checkOut.getTime() - selectedDates.checkIn.getTime()) / (1000 * 60 * 60 * 24))} {t('common.days')}
                </span>
                <span className="font-medium">{calculateTotalPrice().toFixed(0)} ₪</span>
              </div>
              {property.deposit && (
                <div className="flex justify-between text-sm">
                  <span>{t('booking.deposit')}</span>
                  <span className="font-medium">{Number(property.deposit).toFixed(0)} ₪</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('booking.totalPrice')}</span>
                  <span className="text-blue-600">
                    {(calculateTotalPrice() + (property.deposit ? Number(property.deposit) : 0)).toFixed(0)} ₪
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailPage;
