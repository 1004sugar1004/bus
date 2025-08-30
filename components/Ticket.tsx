
import React from 'react';
import type { BookingDetails } from '../types.js';

interface TicketProps {
  bookingDetails: BookingDetails;
  onNewBooking: () => void;
}

const Ticket: React.FC<TicketProps> = ({ bookingDetails, onNewBooking }) => {
    const { departure, arrival, date, bus, seats, totalPrice } = bookingDetails;
    const formattedDate = date?.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.');

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h2 className="text-4xl font-extrabold text-slate-800 mb-2">예매가 완료되었습니다!</h2>
            <p className="text-slate-500 text-xl mb-8">즐거운 여행 되세요.</p>
            
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border-t-8 border-blue-600 relative">
                <div className="absolute top-0 left-1/2 -ml-6 h-12 w-12 bg-slate-100 rounded-full -translate-y-1/2 border-4 border-white"></div>
                <div className="absolute bottom-0 left-1/2 -ml-6 h-12 w-12 bg-slate-100 rounded-full translate-y-1/2 border-4 border-white"></div>

                <div className="flex justify-between items-center pb-4 border-b-2 border-dashed">
                    <div>
                        <p className="text-sm text-slate-500">출발</p>
                        <p className="text-2xl font-bold">{departure?.name}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 mx-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                     <div>
                        <p className="text-sm text-slate-500">도착</p>
                        <p className="text-2xl font-bold">{arrival?.name}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-4 text-left">
                    <div>
                        <p className="text-sm text-slate-500">탑승일</p>
                        <p className="font-semibold text-lg">{formattedDate}</p>
                    </div>
                     <div>
                        <p className="text-sm text-slate-500">출발시간</p>
                        <p className="font-semibold text-lg">{bus?.departureTime}</p>
                    </div>
                     <div>
                        <p className="text-sm text-slate-500">버스 정보</p>
                        <p className="font-semibold text-lg">{bus?.company} ({bus?.grade})</p>
                    </div>
                     <div>
                        <p className="text-sm text-slate-500">좌석번호</p>
                        <p className="font-semibold text-lg text-blue-600">{seats?.join(', ')}</p>
                    </div>
                </div>

                 <div className="mt-6 pt-4 border-t-2 border-dashed flex justify-center">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${departure?.code}-${arrival?.code}-${date?.toISOString()}-${seats?.join('')}`} alt="QR Code"/>
                </div>
            </div>

            <button
                onClick={onNewBooking}
                className="mt-10 py-4 px-10 bg-blue-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
            >
                새 예매 시작하기
            </button>
        </div>
    );
};

export default Ticket;