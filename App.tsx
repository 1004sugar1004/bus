
import React, { useState, useCallback } from 'react';
import { BookingStep } from './types.js';
import type { BookingDetails, BusSchedule, Terminal } from './types.js';
import TerminalSelector from './components/TerminalSelector.js';
import DateSelector from './components/DateSelector.js';
import BusList from './components/BusList.js';
import SeatSelector from './components/SeatSelector.js';
import BookingSummary from './components/BookingSummary.js';
import Payment from './components/Payment.js';
import Ticket from './components/Ticket.js';

const App: React.FC = () => {
  const [bookingStep, setBookingStep] = useState<BookingStep>(BookingStep.SELECT_ROUTE);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({});

  const restartBooking = useCallback(() => {
    setBookingDetails({});
    setBookingStep(BookingStep.SELECT_ROUTE);
  }, []);

  const handleRouteSelect = useCallback((departure: Terminal, arrival: Terminal) => {
    setBookingDetails(prev => ({ ...prev, departure, arrival }));
    setBookingStep(BookingStep.SELECT_DATE);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setBookingDetails(prev => ({ ...prev, date }));
    setBookingStep(BookingStep.SELECT_BUS);
  }, []);

  const handleBusSelect = useCallback((bus: BusSchedule) => {
    setBookingDetails(prev => ({ ...prev, bus }));
    setBookingStep(BookingStep.SELECT_SEAT);
  }, []);

  const handleSeatSelect = useCallback((seats: string[], price: number) => {
    setBookingDetails(prev => ({ ...prev, seats, totalPrice: price }));
    setBookingStep(BookingStep.CONFIRM_BOOKING);
  }, []);

  const handleBookingConfirm = useCallback(() => {
    setBookingStep(BookingStep.PAYMENT);
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    setBookingStep(BookingStep.TICKET);
  }, []);
  
  const goBack = useCallback(() => {
    setBookingStep(prev => {
        if (prev === BookingStep.TICKET) return BookingStep.SELECT_ROUTE;
        if (prev === BookingStep.PAYMENT) return BookingStep.CONFIRM_BOOKING;
        if (prev === BookingStep.CONFIRM_BOOKING) return BookingStep.SELECT_SEAT;
        if (prev === BookingStep.SELECT_SEAT) return BookingStep.SELECT_BUS;
        if (prev === BookingStep.SELECT_BUS) return BookingStep.SELECT_DATE;
        if (prev === BookingStep.SELECT_DATE) return BookingStep.SELECT_ROUTE;
        return prev;
    });
  }, []);


  const renderStep = () => {
    switch (bookingStep) {
      case BookingStep.SELECT_ROUTE:
        return <TerminalSelector onRouteSelect={handleRouteSelect} />;
      
      case BookingStep.SELECT_DATE:
        return <DateSelector onDateSelect={handleDateSelect} onBack={goBack} />;

      case BookingStep.SELECT_BUS:
        if (bookingDetails.departure && bookingDetails.arrival && bookingDetails.date) {
          return <BusList bookingDetails={bookingDetails} onBusSelect={handleBusSelect} onBack={goBack} />;
        }
        // If data is missing, fall back to the start.
        return <TerminalSelector onRouteSelect={handleRouteSelect} />;
        
      case BookingStep.SELECT_SEAT:
        if (bookingDetails.bus) {
          return <SeatSelector bus={bookingDetails.bus} onSeatSelect={handleSeatSelect} onBack={goBack} />;
        }
        return <TerminalSelector onRouteSelect={handleRouteSelect} />;

      case BookingStep.CONFIRM_BOOKING:
        if (bookingDetails.departure && bookingDetails.arrival && bookingDetails.date && bookingDetails.bus && bookingDetails.seats && typeof bookingDetails.totalPrice === 'number') {
          return <BookingSummary bookingDetails={bookingDetails} onConfirm={handleBookingConfirm} onBack={goBack} />;
        }
        return <TerminalSelector onRouteSelect={handleRouteSelect} />;

      case BookingStep.PAYMENT:
        if (typeof bookingDetails.totalPrice === 'number') {
          return <Payment bookingDetails={bookingDetails} onPaymentSuccess={handlePaymentSuccess} onBack={goBack} />;
        }
        return <TerminalSelector onRouteSelect={handleRouteSelect} />;

      case BookingStep.TICKET:
        if (bookingDetails.departure && bookingDetails.arrival && bookingDetails.date && bookingDetails.bus && bookingDetails.seats) {
          return <Ticket bookingDetails={bookingDetails} onNewBooking={restartBooking} />;
        }
        return <TerminalSelector onRouteSelect={handleRouteSelect} />;
        
      default:
        return <TerminalSelector onRouteSelect={handleRouteSelect} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100 font-sans">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{height: '90vh'}}>
        <header className="bg-blue-600 text-white p-5 flex justify-between items-center shadow-md">
          <h1 className="text-3xl font-bold">고속버스 예매</h1>
          <img src="https://picsum.photos/150/50" alt="" className="rounded"/>
        </header>
        <main className="flex-grow p-6 sm:p-8 overflow-y-auto">
            {renderStep()}
        </main>
      </div>
    </div>
  );
};

export default App;
