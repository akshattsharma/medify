import React, { useState } from 'react';

const SLOTS = {
  Morning: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  Afternoon: ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM'],
  Evening: ['4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM'],
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function BookingModal({ hospital, onClose, onBooked }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState(new Date(today));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const isDisabled = (day) => {
    const d = new Date(calYear, calMonth, day);
    return d < today || d > maxDate;
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const d = new Date(calYear, calMonth, day);
    return d.toDateString() === selectedDate.toDateString();
  };

  const isToday = (day) => {
    const d = new Date(calYear, calMonth, day);
    return d.toDateString() === today.toDateString();
  };

  const handleDayClick = (day) => {
    if (isDisabled(day)) return;
    setSelectedDate(new Date(calYear, calMonth, day));
    setSelectedSlot(null);
  };

  const handleConfirm = () => {
    if (!selectedSlot) return;

    let bookings = [];
    try {
      bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    } catch (e) {
      bookings = [];
    }

    // Store with BOTH 'hospitalName' and 'Hospital Name' keys to be safe
    const booking = {
      id: Date.now(),
      hospitalName: hospital['Hospital Name'],
      'Hospital Name': hospital['Hospital Name'],
      address: hospital['Address'],
      'Address': hospital['Address'],
      city: hospital['City'],
      'City': hospital['City'],
      state: hospital['State'],
      'State': hospital['State'],
      zip: hospital['ZIP Code'],
      'ZIP Code': hospital['ZIP Code'],
      rating: hospital['Overall Rating'],
      'Overall Rating': hospital['Overall Rating'],
      date: selectedDate ? selectedDate.toDateString() : today.toDateString(),
      slot: selectedSlot,
    };

    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    console.log('Saved bookings:', localStorage.getItem('bookings'));

    onBooked();
    onClose();
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Book Appointment</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-section">
          <p>Today</p>
          <div className="calendar">
            <div className="calendar-header">
              <button className="cal-nav" onClick={prevMonth}>‹</button>
              <span>{MONTH_NAMES[calMonth]} {calYear}</span>
              <button className="cal-nav" onClick={nextMonth}>›</button>
            </div>
            <div className="calendar-grid">
              {DAY_NAMES.map(d => (
                <div key={d} className="cal-day-name">{d}</div>
              ))}
              {cells.map((day, i) => (
                <div
                  key={i}
                  className={`cal-day ${!day ? 'empty' : ''} ${day && isDisabled(day) ? 'disabled' : ''} ${day && isSelected(day) ? 'selected' : ''} ${day && isToday(day) ? 'today' : ''}`}
                  onClick={() => day && handleDayClick(day)}
                >
                  {day || ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-section">
          <div className="time-section">
            <p>Morning</p>
            <div className="time-slots">
              {SLOTS.Morning.map(t => (
                <button key={t} className={`time-slot ${selectedSlot === t ? 'selected' : ''}`} onClick={() => setSelectedSlot(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="time-section">
            <p>Afternoon</p>
            <div className="time-slots">
              {SLOTS.Afternoon.map(t => (
                <button key={t} className={`time-slot ${selectedSlot === t ? 'selected' : ''}`} onClick={() => setSelectedSlot(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="time-section">
            <p>Evening</p>
            <div className="time-slots">
              {SLOTS.Evening.map(t => (
                <button key={t} className={`time-slot ${selectedSlot === t ? 'selected' : ''}`} onClick={() => setSelectedSlot(t)}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        <button
          className="confirm-btn"
          disabled={!selectedSlot}
          onClick={handleConfirm}
        >
          Book FREE Center Visit
        </button>
      </div>
    </div>
  );
}

export default BookingModal;