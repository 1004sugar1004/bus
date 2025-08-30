
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Terminal } from '../types.js';
import { fetchTerminals } from '../services/geminiService.js';

interface TerminalSelectorProps {
  onRouteSelect: (departure: Terminal, arrival: Terminal) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
);

const TerminalColumn: React.FC<{ title: string; terminals: Terminal[]; selectedTerminal?: Terminal; onSelect: (terminal: Terminal) => void; disabledTerminals: Set<string>}> = ({ title, terminals, selectedTerminal, onSelect, disabledTerminals }) => (
    <div className="flex-1 flex flex-col bg-slate-50 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-center text-slate-700 mb-4 pb-2 border-b-2">{title}</h3>
        <div className="overflow-y-auto space-y-2 pr-2">
            {terminals.map((terminal) => (
                <button
                    key={terminal.code}
                    onClick={() => onSelect(terminal)}
                    disabled={disabledTerminals.has(terminal.code)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 text-lg
                        ${selectedTerminal?.code === terminal.code
                            ? 'bg-blue-200 text-blue-800 font-bold shadow-lg ring-2 ring-blue-500'
                            : 'bg-white text-slate-700 hover:bg-blue-50 hover:shadow-md'
                        }
                        ${disabledTerminals.has(terminal.code) ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {terminal.name}
                </button>
            ))}
        </div>
    </div>
);


const TerminalSelector: React.FC<TerminalSelectorProps> = ({ onRouteSelect }) => {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [departure, setDeparture] = useState<Terminal | undefined>();
  const [arrival, setArrival] = useState<Terminal | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTerminals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTerminals = await fetchTerminals();
        setTerminals(fetchedTerminals);
      } catch (e) {
        console.error(e);
        setError('터미널 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };
    loadTerminals();
  }, []);

  const handleNext = useCallback(() => {
    if (departure && arrival) {
      onRouteSelect(departure, arrival);
    }
  }, [departure, arrival, onRouteSelect]);

  const disabledDepartureTerminals = useMemo(() => new Set([arrival?.code]), [arrival]);
  const disabledArrivalTerminals = useMemo(() => new Set([departure?.code]), [departure]);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <LoadingSpinner/>
            <p className="text-xl text-slate-600 mt-4 font-semibold">터미널 정보를 불러오는 중입니다...</p>
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 font-bold text-xl p-8">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800">어디로 가시나요?</h2>
            <p className="text-slate-500 text-lg mt-2">출발지와 도착지를 선택해주세요.</p>
        </div>
        
        <div className="flex-grow flex gap-6 md:gap-8 overflow-hidden">
            <TerminalColumn title="출발지" terminals={terminals} selectedTerminal={departure} onSelect={setDeparture} disabledTerminals={disabledDepartureTerminals} />
            
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="p-3 bg-slate-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                </div>
            </div>

            <TerminalColumn title="도착지" terminals={terminals} selectedTerminal={arrival} onSelect={setArrival} disabledTerminals={disabledArrivalTerminals} />
        </div>

        <div className="mt-8 text-center">
            <button
                onClick={handleNext}
                disabled={!departure || !arrival}
                className="w-full max-w-md py-4 px-8 bg-blue-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            >
                날짜 선택하기
            </button>
        </div>
    </div>
  );
};

export default TerminalSelector;
