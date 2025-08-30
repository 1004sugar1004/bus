
import React from 'react';
import type { BookingDetails } from '../types.js';

interface BookingSummaryProps {
  bookingDetails: BookingDetails;
  onConfirm: () => void;
  onBack: () => void;
}

const InfoRow: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-4 border-b border-slate-200">
        <dt className="text-lg text-slate-500 font-semibold">{label}</dt>
        <dd className="text-lg text-slate-800 font-bold">{value}</dd>
    </div>
);


const BookingSummary: React.FC<BookingSummaryProps> = ({ bookingDetails, onConfirm, onBack }) => {
  const { departure, arrival, date, bus, seats, totalPrice } = bookingDetails;
  const formattedDate = date?.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-4xl font-extrabold text-slate-800 mb-4">예매 정보를 확인해주세요.</h2>
        <p className="text-slate-500 text-xl mb-8">정보가 맞다면 결제를 진행해주세요.</p>
      
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-xl">
            <dl>
                <InfoRow label="출발지" value={departure?.name} />
                <InfoRow label="도착지" value={arrival?.name} />
                <InfoRow label="출발일" value={formattedDate} />
                <InfoRow label="출발시간" value={`${bus?.departureTime} (${bus?.company} / ${bus?.grade})`} />
                <InfoRow label="선택좌석" value={seats?.join(', ')} />
            </dl>
            <div className="mt-8 pt-6 border-t-4 border-dashed border-slate-300 flex justify-between items-baseline">
                <span className="text-2xl text-slate-600 font-bold">총 결제금액</span>
                <span className="text-4xl text-blue-600 font-extrabold">{totalPrice?.toLocaleString()}원</span>
            </div>
        </div>
        
        <div className="mt-10 flex gap-4 w-full max-w-2xl">
            <button
                onClick={onBack}
                className="w-1/3 py-4 bg-slate-500 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-slate-600 transition-all duration-300"
            >
                수정하기
            </button>
            <button
                onClick={onConfirm}
                className="w-2/3 py-4 bg-blue-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
                결제하기
            </button>
        </div>
    </div>
  );
};

export default BookingSummary;