
export enum BookingStep {
  SELECT_ROUTE,
  SELECT_DATE,
  SELECT_BUS,
  SELECT_SEAT,
  CONFIRM_BOOKING,
  PAYMENT,
  TICKET,
}

export interface Terminal {
  name: string;
  code: string;
}

export interface BusSchedule {
  company: string;
  grade: '프리미엄' | '우등' | '일반';
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
}

export interface BookingDetails {
  departure?: Terminal;
  arrival?: Terminal;
  date?: Date;
  bus?: BusSchedule;
  seats?: string[];
  totalPrice?: number;
}