import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingModal from '../components/BookingModal';

function StarRating({ rating }) {
  const r = parseFloat(rating) || 0;
  const stars = Math.round(r);
  return (
    <div className="rating">
      <span className="stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
      <span className="rating-val">{rating || 'N/A'}</span>
    </div>
  );
}

function SearchResults() {
  const [searchParams] = useSearchParams();
  const state = searchParams.get('state') || '';
  const city = searchParams.get('city') || '';

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    if (!state || !city) return;
    setLoading(true);
    fetch(`https://meddata-backend.onrender.com/data?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`)
      .then(res => res.json())
      .then(data => { setHospitals(data); setLoading(false); })
      .catch(err => { console.error('Error fetching hospitals:', err); setLoading(false); });
  }, [state, city]);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Fetching medical centers… this may take up to 60 seconds.</p>
          </div>
        ) : (
          <>
            <div className="results-header">
              <h1>{hospitals.length} medical centers available in {city.toLowerCase()}</h1>
              <p>Showing results for {city}, {state}</p>
            </div>

            {hospitals.length === 0 ? (
              <div className="bookings-empty">
                <div className="icon">🏥</div>
                <p>No medical centers found for this location.</p>
              </div>
            ) : (
              hospitals.map((h, i) => (
                <div className="hospital-card" key={i}>
                  <div className="hospital-info">
                    <h3>{h['Hospital Name']}</h3>
                    <div className="hospital-meta">
                      <span>📍 {h['Address']}, {h['City']}, {h['State']} {h['ZIP Code']}</span>
                    </div>
                    <StarRating rating={h['Overall Rating']} />
                  </div>
                  <button className="book-btn" onClick={() => setSelectedHospital(h)}>
                    Book FREE Center Visit
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {selectedHospital && (
        <BookingModal
          hospital={selectedHospital}
          onClose={() => setSelectedHospital(null)}
          onBooked={() => setBooked(true)}
        />
      )}

      {booked && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#1a8a7a', color: 'white',
          padding: '14px 24px', borderRadius: 12,
          fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 300
        }}>
          ✓ Appointment booked! Check My Bookings.
        </div>
      )}
    </div>
  );
}

export default SearchResults;