
import React, { useState, useEffect } from 'react';
import type { BookingDetails } from '../types.js';

interface PaymentProps {
  bookingDetails: BookingDetails;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500"></div>
);

const CheckmarkIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const CardIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);


const Payment: React.FC<PaymentProps> = ({ bookingDetails, onPaymentSuccess, onBack }) => {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    useEffect(() => {
        if (status === 'idle') {
            const timer = setTimeout(() => setStatus('processing'), 3000);
            return () => clearTimeout(timer);
        }
        if (status === 'processing') {
            const timer = setTimeout(() => setStatus('success'), 4000);
            return () => clearTimeout(timer);
        }
        if (status === 'success') {
            const timer = setTimeout(onPaymentSuccess, 2000);
            return () => clearTimeout(timer);
        }
    }, [status, onPaymentSuccess]);

    const statusConfig = {
        idle: {
            icon: <CardIcon />,
            title: "신용/체크카드를 넣어주세요",
            message: "IC칩이 위로 향하게 하여 투입구에 끝까지 넣어주세요.",
            color: "text-slate-800"
        },
        processing: {
            icon: <LoadingSpinner />,
            title: "결제 처리 중입니다",
            message: "결제가 완료될 때까지 카드를 빼지 마세요.",
            color: "text-blue-600"
        },
        success: {
            icon: <CheckmarkIcon />,
            title: "결제가 완료되었습니다",
            message: "잠시 후 예매 내역이 표시됩니다.",
            color: "text-green-500"
        }
    };

    const currentStatus = statusConfig[status];

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-full max-w-2xl">
                <div className="mb-8">
                    <p className="text-xl text-slate-600">총 결제금액</p>
                    <p className="text-6xl font-extrabold text-blue-600 tracking-tighter">
                        {bookingDetails.totalPrice?.toLocaleString() ?? 0}원
                    </p>
                </div>
                
                <div className="bg-slate-100 rounded-2xl p-10 flex flex-col items-center justify-center min-h-[300px] shadow-inner">
                    <div className="mb-6">{currentStatus.icon}</div>
                    <h2 className={`text-3xl font-bold ${currentStatus.color} mb-2`}>{currentStatus.title}</h2>
                    <p className="text-lg text-slate-500">{currentStatus.message}</p>
                </div>

                 <div className="mt-8 border-t-8 border-b-8 border-dotted border-slate-300 h-8 relative">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 bg-slate-800 h-2 animate-pulse"></div>
                    <p className="absolute -top-4 left-4 bg-slate-100 px-2 text-slate-500 text-sm font-bold">CARD INSERT</p>
                </div>

                 <div className="mt-12 flex justify-center">
                    <button
                        onClick={onBack}
                        disabled={status !== 'idle'}
                        className="py-4 px-12 bg-slate-500 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        결제 취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;