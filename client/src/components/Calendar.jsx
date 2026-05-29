import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
  };

  const days = [];
  for (let i = 0; i < startWeekday; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = isCurrentMonth && day === todayDate;
    days.push(
      <div
        key={day}
        className={`w-8 h-8 flex items-center justify-center text-sm rounded-full transition-all ${
          isToday
            ? 'bg-accent-primary text-white font-semibold shadow-lg shadow-accent-primary/30'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="glass-card p-4 w-fit">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-white">
          {formatMonth(currentDate)}
        </span>
        <button
          onClick={nextMonth}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="w-8 h-6 flex items-center justify-center text-xs text-gray-500 font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
}