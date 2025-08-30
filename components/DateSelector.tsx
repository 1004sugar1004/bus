import React, { useState, useMemo } from 'react';

interface DateSelectorProps {
  onDateSelect: (date: Date) => void;
  onBack: () => void;
}

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const MonthView: React.FC<{
    year: number;
    month: number;
    calendarDays: (Date | null)[];
    today: Date;
    onDateClick: (day: Date | null) => void;
}> = ({ year, month, calendarDays, today, onDateClick }) => {
    return (
        <div className="flex-1">
            <h3 className="text-xl font-bold text-center text-slate-700 mb-4">{`${year}년 ${month + 1}월`}</h3>
            <div className="grid grid-cols-7 gap-1 text-center">
                {weekDays.map(day => <div key={day} className="font-semibold text-slate-500 text-sm py-2">{day}</div>)}
                {calendarDays.map((day, index) => {
                    const isPast = day && day < today;
                    const isToday = day && day.getTime() === today.getTime();
                    return (
                        <div key={index} className="flex justify-center items-center p-0.5">
                            {day ? (
                                <button
                                    onClick={() => onDateClick(day)}
                                    disabled={!!isPast}
                                    className={`w-10 h-10 rounded-full transition-colors duration-200 flex items-center justify-center text-base
                                      ${isPast ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-blue-100'}
                                      ${isToday ? 'bg-blue-600 text-white font-bold' : 'text-slate-700'}
                                    `}
                                >
                                    {day.getDate()}
                                </button>
                            ) : <div className="w-10 h-10"></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const generateCalendarDays = (year: number, month: number) => {
    const days = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
    }
    return days;
};

const DateSelector: React.FC<DateSelectorProps> = ({ onDateSelect, onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const currentMonthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return {
        year,
        month,
        calendarDays: generateCalendarDays(year, month),
    };
  }, [currentDate]);

  const nextMonthDate = useMemo(() => new Date(currentMonthData.year, currentMonthData.month + 1, 1), [currentMonthData]);

  const nextMonthData = useMemo(() => {
    const year = nextMonthDate.getFullYear();
    const month = nextMonthDate.getMonth();
    return {
        year,
        month,
        calendarDays: generateCalendarDays(year, month),
    };
  }, [nextMonthDate]);
  
  const handleDateClick = (day: Date | null) => {
    if (day && day >= today) {
        onDateSelect(day);
    }
  };

  const isPastMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth());
  }, [currentDate, today]);

  const prevMonth = () => {
    if (isPastMonth) return;
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col h-full items-center">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">언제 출발하시나요?</h2>
        <p className="text-slate-500 text-lg mt-2">출발 날짜를 선택해주세요.</p>
      </div>

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4 px-4">
          <button onClick={prevMonth} disabled={isPastMonth} className="p-2 rounded-full hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="flex gap-8">
            <MonthView {...currentMonthData} today={today} onDateClick={handleDateClick} />
            <MonthView {...nextMonthData} today={today} onDateClick={handleDateClick} />
        </div>
      </div>
       <div className="mt-8">
            <button
                onClick={onBack}
                className="py-3 px-8 bg-slate-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-slate-600 transition-colors"
            >
                뒤로가기
            </button>
        </div>
    </div>
  );
};

export default DateSelector;
