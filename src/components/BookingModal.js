import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(stored);
  }, []);

  const handleDelete = (id) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="results-header">
          <h1>My Bookings</h1>
          <p>Your scheduled medical center appointments</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bookings-empty">
            <div className="icon">📋</div>
            <p>You have no bookings yet. Search for medical centers to book an appointment.</p>
          </div>
        ) : (
          bookings.map(b => (
            <div className="booking-card" key={b.id}>
              <h3>{b.hospitalName}</h3>
              <div className="booking-detail">
                <span>📍 {b.address}, {b.city}, {b.state} {b.zip}</span>
                <span>📅 {b.date}</span>
                <span>🕐 {b.slot}</span>
                {b.rating && b.rating !== 'Not Available' && (
                  <span>⭐ Rating: {b.rating}</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                <span className="badge">✓ Confirmed</span>
                <button
                  onClick={() => handleDelete(b.id)}
                  style={{
                    background: 'none', border: '1px solid #e2e8f0',
                    borderRadius: 6, padding: '4px 12px',
                    fontSize: '0.8rem', cursor: 'pointer',
                    color: '#718096'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBookings;