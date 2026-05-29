import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

const HOLIDAYS_2026 = {
  '1-1': '元旦',
  '2-17': '农历年初一',
  '2-18': '农历年初二',
  '2-19': '农历年初三',
  '4-3': '耶稣受难节',
  '4-4': '耶稣受难节翌日',
  '4-6': '清明节翌日',
  '4-7': '复活节星期一翌日',
  '5-1': '劳动节',
  '5-25': '佛诞翌日',
  '6-19': '端午节',
  '7-1': '香港回归纪念日',
  '9-26': '中秋节翌日',
  '10-1': '国庆日',
  '10-19': '重阳节翌日',
  '12-25': '圣诞节',
  '12-26': '圣诞节后首个周日',
};

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

  const isHoliday = (day) => {
    const key = `${month + 1}-${day}`;
    return HOLIDAYS_2026[key] || null;
  };

  const days = [];
  for (let i = 0; i < startWeekday; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = isCurrentMonth && day === todayDate;
    const holiday = isHoliday(day);
    const isSunday = new Date(year, month, day).getDay() === 0;

    let cellClass = 'w-8 h-8 flex items-center justify-center text-sm rounded-full transition-all cursor-default';
    let textClass = 'text-gray-400';
    let badgeClass = '';
    let title = '';

    if (holiday) {
      cellClass += ' bg-red-500/20';
      textClass = 'text-red-400 font-semibold';
      badgeClass = 'bg-red-500/30';
      title = holiday;
    } else if (isSunday) {
      textClass = 'text-orange-400';
      title = '星期日';
    }

    if (isToday) {
      cellClass += ' bg-accent-primary text-white font-semibold shadow-lg shadow-accent-primary/30';
      textClass = 'text-white';
    }

    days.push(
      <div
        key={day}
        className={cellClass}
        title={title}
      >
        <span className={textClass}>{day}</span>
        {holiday && (
          <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500`} />
        )}
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
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`w-8 h-6 flex items-center justify-center text-xs font-medium ${
              index === 0 ? 'text-red-400' : 'text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
}