import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { ru, he, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CalendarProps {
  selectedDates?: {
    checkIn: Date | null;
    checkOut: Date | null;
  };
  onDateSelect?: (date: Date) => void;
  blockedDates?: Array<{ startDate: string; endDate: string }>;
  minDate?: Date;
  selectRange?: boolean;
}

const Calendar = ({ 
  selectedDates = { checkIn: null, checkOut: null },
  onDateSelect,
  blockedDates = [],
  minDate = new Date(),
  selectRange = true
}: CalendarProps) => {
  const { i18n } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const locale = i18n.language === 'ru' ? ru : i18n.language === 'he' ? he : enUS;
  const isRTL = i18n.language === 'he';

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Добавляем пустые дни для выравнивания
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blocked => {
      const start = new Date(blocked.startDate);
      const end = new Date(blocked.endDate);
      return date >= start && date <= end;
    });
  };

  const isDateInRange = (date: Date) => {
    if (!selectRange || !selectedDates.checkIn || !selectedDates.checkOut) return false;
    return date > selectedDates.checkIn && date < selectedDates.checkOut;
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(startOfDay(date), startOfDay(minDate)) || isDateBlocked(date);
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    onDateSelect?.(date);
  };

  const getDayClassName = (date: Date) => {
    const baseClass = 'w-12 h-12 flex items-center justify-center rounded-full text-sm transition-all';
    
    if (isDateDisabled(date)) {
      return `${baseClass} text-gray-300 cursor-not-allowed line-through`;
    }

    if (selectedDates.checkIn && isSameDay(date, selectedDates.checkIn)) {
      return `${baseClass} bg-blue-600 text-white font-bold`;
    }

    if (selectedDates.checkOut && isSameDay(date, selectedDates.checkOut)) {
      return `${baseClass} bg-blue-600 text-white font-bold`;
    }

    if (isDateInRange(date)) {
      return `${baseClass} bg-blue-100 text-blue-800`;
    }

    if (isToday(date)) {
      return `${baseClass} border-2 border-blue-600 text-blue-600 font-semibold`;
    }

    if (!isSameMonth(date, currentMonth)) {
      return `${baseClass} text-gray-400`;
    }

    return `${baseClass} hover:bg-gray-100 cursor-pointer`;
  };

  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const weekDaysHe = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  const weekDaysEn = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getWeekDays = () => {
    if (i18n.language === 'he') return weekDaysHe;
    if (i18n.language === 'en') return weekDaysEn;
    return weekDays;
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'LLLL yyyy', { locale })}
        </h3>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Week days */}
      <div className={`grid grid-cols-7 gap-1 mb-2 ${isRTL ? 'rtl' : ''}`}>
        {getWeekDays().map((day, index) => (
          <div
            key={index}
            className="w-12 h-8 flex items-center justify-center text-xs font-medium text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className={`grid grid-cols-7 gap-1 ${isRTL ? 'rtl' : ''}`}>
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="w-12 h-12" />
        ))}
        {daysInMonth.map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            className={getDayClassName(date)}
            disabled={isDateDisabled(date)}
          >
            {format(date, 'd')}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
          <span>Выбрано</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded-full"></div>
          <span>В диапазоне</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 rounded-full"></div>
          <span>Сегодня</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <span>Недоступно</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
