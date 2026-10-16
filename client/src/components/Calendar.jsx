import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plane } from 'lucide-react';

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

const AIRSHOW_2026 = {
  '12-7': { type: 'opening', label: '珠海航展开幕式' },
  '12-8': { type: 'professional', label: '珠海航展专业日' },
  '12-9': { type: 'professional', label: '珠海航展专业日' },
  '12-10': { type: 'professional', label: '珠海航展专业日' },
  '12-11': { type: 'public', label: '珠海航展公众日' },
  '12-12': { type: 'public', label: '珠海航展公众日' },
  '12-13': { type: 'public', label: '珠海航展公众日' },
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

  const getAirshow = (day) => {
    const key = `${month + 1}-${day}`;
    return AIRSHOW_2026[key] || null;
  };

  const days = [];
  for (let i = 0; i < startWeekday; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = isCurrentMonth && day === todayDate;
    const holiday = isHoliday(day);
    const airshow = getAirshow(day);
    const isSunday = new Date(year, month, day).getDay() === 0;

    let cellClass = 'w-8 h-8 flex items-center justify-center text-sm rounded-full transition-all cursor-default';
    let textClass = 'text-gray-400';
    let badgeClass = '';
    let title = '';
    let iconColor = '';

    if (airshow) {
      cellClass += ' relative';
      title = airshow.label;
      if (airshow.type === 'opening') {
        cellClass += ' bg-blue-500/30';
        textClass = 'text-blue-400 font-semibold';
        iconColor = 'text-blue-400';
      } else if (airshow.type === 'professional') {
        cellClass += ' bg-blue-500/10';
        textClass = 'text-blue-300';
        iconColor = 'text-blue-400';
      } else if (airshow.type === 'public') {
        cellClass += ' bg-red-500/10';
        textClass = 'text-red-300';
        iconColor = 'text-red-400';
      }
    } else if (holiday) {
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
        {airshow && (
          <Plane className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${iconColor} ${airshow.type === 'opening' ? 'fill-current' : ''}`} />
        )}
        {holiday && !airshow && (
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