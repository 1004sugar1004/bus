
import React, { useState, useEffect, useCallback } from 'react';
import type { BusSchedule, BookingDetails } from '../types';
import { fetchSchedules } from '../services/geminiService';

interface BusListProps {
  bookingDetails: BookingDetails;
  onBusSelect: (bus: BusSchedule) => void;
  onBack: () => void;
}

const BusCardSkeleton: React.FC = () => (
    <div className="w-full bg-white p-4 rounded-lg shadow-md animate-pulse">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="h-10 w-24 bg-slate-200 rounded"></div>
                <div className="h-4 w-16 bg-slate-200 rounded"></div>
            </div>
            <div className="h-8 w-20 bg-slate-200 rounded"></div>
        </div>
        <div className="mt-4 flex justify-between items-center">
            <div className="h-6 w-32 bg-slate-200 rounded"></div>
            <div className="h-6 w-24 bg-slate-200 rounded"></div>
        </div>
    </div>
);


const BusList: React.FC<BusListProps> = ({ bookingDetails, onBusSelect, onBack }) => {
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { departure, arrival, date } = bookingDetails;
  const formattedDate = date?.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  const loadSchedules = useCallback(async () => {
    if (departure && arrival && date) {
      try {
        setIsLoading(true);
        const fetchedSchedules = await fetchSchedules(departure.name, arrival.name, date.toISOString().split('T')[0]);
        setSchedules(fetchedSchedules);
        setError(null);
      } catch (e) {
        setError('운행 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  }, [departure, arrival, date]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const getGradeColor = (grade: string) => {
      switch (grade) {
          case '프리미엄': return 'bg-yellow-400 text-yellow-800';
          case '우등': return 'bg-purple-400 text-purple-800';
          case '일반': return 'bg-green-400 text-green-800';
          default: return 'bg-slate-400 text-slate-800';
      }
  }

  if (isLoading) {
    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
                {departure?.name} → {arrival?.name}
            </h2>
            <p className="text-slate-500 text-lg text-center mb-6">{formattedDate}</p>
            {Array.from({ length: 5 }).map((_, index) => <BusCardSkeleton key={index} />)}
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 font-bold text-xl">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">{departure?.name} → {arrival?.name}</h2>
        <p className="text-slate-500 text-lg mt-2">{formattedDate}</p>
      </div>
      
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {schedules.length > 0 ? (
            schedules.map((bus, index) => (
            <button key={index} onClick={() => onBusSelect(bus)} className="w-full text-left bg-white p-5 rounded-lg shadow-md hover:shadow-xl hover:border-blue-500 border-2 border-transparent transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none" disabled={bus.availableSeats === 0}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-extrabold text-slate-800">{bus.departureTime}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        <span className="text-2xl font-bold text-slate-600">{bus.arrivalTime}</span>
                    </div>
                    <div className={`px-3 py-1 text-sm font-bold rounded-full ${getGradeColor(bus.grade)}`}>
                        {bus.grade}
                    </div>
                </div>
                <div className="mt-4 flex justify-between items-end">
                    <div>
                        <p className="text-slate-700 font-semibold">{bus.company}</p>
                        <p className="text-sm text-slate-500">약 {bus.duration} 소요</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">{bus.price.toLocaleString()}원</p>
                        <p className="text-slate-600">잔여: <span className="font-bold">{bus.availableSeats}</span>/{bus.totalSeats}</p>
                    </div>
                </div>
                {bus.availableSeats === 0 && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><span className="text-2xl font-bold text-red-500">매진</span></div>}
            </button>
            ))
        ) : (
            <div className="text-center py-10">
                <p className="text-xl text-slate-500">해당 날짜에 운행 정보가 없습니다.</p>
            </div>
        )}
      </div>
       <div className="mt-8 text-center">
            <button
                onClick={onBack}
                className="py-3 px-8 bg-slate-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-slate-600 transition-colors"
            >
                날짜 다시 선택
            </button>
        </div>
    </div>
  );
};

export default BusList;
