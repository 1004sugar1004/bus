
import type { Terminal, BusSchedule } from '../types.js';

export const mockTerminals: Terminal[] = [
  { name: '서울경부', code: 'SEL' },
  { name: '센트럴시티(서울)', code: 'CEN' },
  { name: '동서울', code: 'ESEL' },
  { name: '부산', code: 'BUS' },
  { name: '서부산(사상)', code: 'WBUS' },
  { name: '대구', code: 'DAE' },
  { name: '광주(유·스퀘어)', code: 'GWA' },
  { name: '인천', code: 'INC' },
  { name: '대전복합', code: 'DAJ' },
  { name: '울산', code: 'ULS' },
  { name: '전주', code: 'JEO' },
  { name: '수원', code: 'SUW' },
  { name: '강릉', code: 'GAN' },
  { name: '청주', code: 'CHE' },
  { name: '포항', code: 'POH' },
];

const companies = ['중앙고속', '금호고속', '동양고속', '삼화고속', '한일고속'];
const grades = ['프리미엄', '우등', '일반'] as const;

// Helper to format time
const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Helper to add minutes to a date
const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

export const generateMockSchedules = (departure: string, arrival: string, date: string): BusSchedule[] => {
  const schedules: BusSchedule[] = [];
  const numberOfSchedules = 8 + Math.floor(Math.random() * 5); // 8 to 12 schedules

  let startTime = new Date(`${date}T06:00:00`);

  for (let i = 0; i < numberOfSchedules; i++) {
    // Increment start time for each bus
    startTime = addMinutes(startTime, Math.floor(Math.random() * 60) + 30); // 30-90 min intervals

    const grade = grades[Math.floor(Math.random() * grades.length)];
    const durationMinutes = 200 + Math.floor(Math.random() * 120); // 3h 20m to 5h 20m
    const arrivalTime = addMinutes(startTime, durationMinutes);
    const durationHours = Math.floor(durationMinutes / 60);
    const durationMins = durationMinutes % 60;
    
    let totalSeats: number;
    let price: number;
    switch (grade) {
      case '프리미엄':
        totalSeats = 21;
        price = 40000 + Math.floor(Math.random() * 10000);
        break;
      case '우등':
        totalSeats = 28;
        price = 30000 + Math.floor(Math.random() * 8000);
        break;
      case '일반':
        totalSeats = 45;
        price = 20000 + Math.floor(Math.random() * 5000);
        break;
    }

    const availableSeats = Math.floor(Math.random() * (totalSeats + 1));

    schedules.push({
      company: companies[Math.floor(Math.random() * companies.length)],
      grade,
      departureTime: formatTime(startTime),
      arrivalTime: formatTime(arrivalTime),
      duration: `${durationHours}시간 ${durationMins}분`,
      price: Math.round(price / 100) * 100, // Round to nearest 100
      totalSeats,
      availableSeats,
    });
  }

  return schedules;
};
