import React, { useState, useMemo, useCallback } from 'react';
import type { BusSchedule } from '../types';

interface SeatSelectorProps {
  bus: BusSchedule;
  onSeatSelect: (seats: string[], totalPrice: number) => void;
  onBack: () => void;
}

const Seat: React.FC<{ status: 'available' | 'occupied' | 'selected'; label: string; onClick: () => void; }> = ({ status, label, onClick }) => {
    const baseClasses = "w-12 h-12 rounded-md flex items-center justify-center font-bold text-sm border-2 transition-all duration-200";
    const statusClasses = {
        available: "bg-slate-200 border-slate-300 text-slate-600 hover:bg-blue-200 hover:border-blue-400 cursor-pointer",
        occupied: "bg-slate-500 border-slate-600 text-white cursor-not-allowed",
        selected: "bg-blue-600 border-blue-800 text-white shadow-lg transform scale-110",
    };
    return <button onClick={onClick} disabled={status === 'occupied'} className={`${baseClasses} ${statusClasses[status]}`}>{label}</button>;
};


const SeatSelector: React.FC<SeatSelectorProps> = ({ bus, onSeatSelect, onBack }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const seatLayout = useMemo(() => {
    const layout = { rows: 0, cols: 0, structure: [] as (string|null)[][] };
    if (bus.grade === '프리미엄') {
      layout.rows = 7;
      layout.cols = 4; // 1, 2, space, 3
      layout.structure = Array.from({ length: 7 }, (_, r) => [ `${r*3+1}`, `${r*3+2}`, null, `${r*3+3}`]);
    } else if (bus.grade === '우등') {
      layout.rows = 10;
      layout.cols = 4; // 1, 2, space, 3 -> last rows can be different
      layout.structure = Array.from({ length: 9 }, (_, r) => [ `${r*3+1}`, `${r*3+2}`, null, `${r*3+3}`]);
      layout.structure.push(['28', null, null, null]);
    } else { // 일반
      layout.rows = 12;
      layout.cols = 5; // 1, 2, space, 3, 4
      layout.structure = Array.from({ length: 11 }, (_, r) => [`${r*4+1}`, `${r*4+2}`, null, `${r*4+3}`, `${r*4+4}`]);
      layout.structure.push(['45', null, null, null, null]);
    }

    const flatSeats = layout.structure.flat().filter(s => s !== null) as string[];
    const validSeats = flatSeats.filter(s => parseInt(s) <= bus.totalSeats);

    // Filter out invalid seats from structure
    layout.structure = layout.structure.map(row => 
      row.map(seat => seat && validSeats.includes(seat) ? seat : null)
    );

    return layout;
  }, [bus.grade, bus.totalSeats]);

  const occupiedSeats = useMemo(() => {
    const occupied = new Set<string>();
    const numOccupied = bus.totalSeats - bus.availableSeats;
    const seatNumbers = Array.from({ length: bus.totalSeats }, (_, i) => `${i + 1}`);
    while (occupied.size < numOccupied) {
      const randomIndex = Math.floor(Math.random() * seatNumbers.length);
      occupied.add(seatNumbers[randomIndex]);
      seatNumbers.splice(randomIndex, 1);
    }
    return occupied;
  }, [bus.totalSeats, bus.availableSeats]);
  
  const handleSeatClick = useCallback((seatNumber: string) => {
    setSelectedSeats(prev => {
        const newSelection = new Set(prev);
        if (newSelection.has(seatNumber)) {
            newSelection.delete(seatNumber);
        } else {
            newSelection.add(seatNumber);
        }
        return Array.from(newSelection).sort((a,b) => parseInt(a) - parseInt(b));
    });
  }, []);

  const totalPrice = selectedSeats.length * bus.price;

  const handleConfirm = () => {
      if(selectedSeats.length > 0) {
          onSeatSelect(selectedSeats, totalPrice);
      }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8">
      <div className="lg:w-2/3 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">좌석을 선택해주세요.</h2>
        <p className="text-slate-500 mb-6">선택하신 버스는 <span className="font-bold text-blue-600">{bus.grade}</span> 등급입니다.</p>
        
        <div className="bg-slate-100 p-6 rounded-xl shadow-inner w-full flex-grow flex flex-col items-center">
            <div className="w-full bg-slate-300 text-center py-2 rounded-t-lg font-bold text-slate-700">전방</div>
            <div className="bg-white p-4 flex-grow flex justify-center items-center">
                <div className="grid gap-x-2 gap-y-1" style={{gridTemplateColumns: `repeat(${seatLayout.cols}, auto)`}}>
                    {seatLayout.structure.flat().map((seat, index) => {
                        if (!seat) return <div key={index} className="w-12 h-12"></div>;
                        const isSelected = selectedSeats.includes(seat);
                        const isOccupied = occupiedSeats.has(seat);
                        let status: 'available' | 'occupied' | 'selected' = 'available';
                        if (isSelected) status = 'selected';
                        else if (isOccupied) status = 'occupied';
                        
                        return <Seat key={seat} label={seat} status={status} onClick={() => handleSeatClick(seat)} />;
                    })}
                </div>
            </div>
             <div className="mt-4 flex justify-center gap-6 text-sm text-black">
                <div className="flex items-center gap-2"><div className="w-5 h-5 bg-slate-200 border-2 border-slate-300 rounded-sm"></div><span>선택가능</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-5 bg-blue-600 border-2 border-blue-800 rounded-sm"></div><span>선택좌석</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-5 bg-slate-500 border-2 border-slate-600 rounded-sm"></div><span>예매완료</span></div>
            </div>
        </div>
      </div>
      
      <div className="lg:w-1/3 bg-slate-50 p-6 rounded-lg shadow-lg flex flex-col justify-between">
        <div>
            <h3 className="text-2xl font-bold border-b-2 pb-2 mb-4">선택 정보</h3>
            <div className="text-lg mb-2">
                <span className="font-semibold text-slate-600">선택 좌석: </span>
                <span className="font-extrabold text-blue-600">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '없음'}</span>
            </div>
             <div className="text-lg">
                <span className="font-semibold text-slate-600">인원: </span>
                <span className="font-extrabold text-blue-600">{selectedSeats.length} 명</span>
            </div>
        </div>
        <div>
            <div className="border-t-2 pt-4 mt-4">
                <div className="flex justify-between items-center text-2xl font-bold">
                    <span>총 결제금액</span>
                    <span>{totalPrice.toLocaleString()} 원</span>
                </div>
            </div>
            <div className="mt-6 flex flex-col gap-4">
                <button 
                    onClick={handleConfirm}
                    disabled={selectedSeats.length === 0}
                    className="w-full py-4 bg-blue-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-slate-400 transition-all">
                    예매하기
                </button>
                 <button 
                    onClick={onBack}
                    className="w-full py-3 bg-slate-200 text-slate-700 font-bold text-lg rounded-lg hover:bg-slate-300 transition-colors">
                    뒤로가기
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;