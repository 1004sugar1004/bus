
import type { Terminal, BusSchedule } from '../types.js';
import { mockTerminals, generateMockSchedules } from './mockData.js';

export const fetchTerminals = async (): Promise<Terminal[]> => {
  // Simulate network delay for a better user experience
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockTerminals);
    }, 500);
  });
};

export const fetchSchedules = async (departure: string, arrival: string, date: string): Promise<BusSchedule[]> => {
  // Simulate network delay for a better user experience
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(generateMockSchedules(departure, arrival, date));
    }, 1000);
  });
};
