import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://meddata-backend.onrender.com/states')
      .then(res => res.json())
      .then(data => { setStates(data); setLoadingStates(false); })
      .catch(err => { console.error('Error fetching states:', err); setLoadingStates(false); });
  }, []);

  useEffect(() => {
    if (!selectedState) { setCities([]); setSelectedCity(''); return; }
    setLoadingCities(true);
    fetch(`https://meddata-backend.onrender.com/cities/${selectedState}`)
      .then(res => res.json())
      .then(data => { setCities(data); setSelectedCity(''); setLoadingCities(false); })
      .catch(err => { console.error('Error fetching cities:', err); setLoadingCities(false); });
  }, [selectedState]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedState || !selectedCity) return;
    navigate(`/search?state=${encodeURIComponent(selectedState)}&city=${encodeURIComponent(selectedCity)}`);
  };

  return (
    <div>
      <Navbar />

      <div className="hero">
        <h1>Your Health, Our Priority</h1>
        <p>Find and book medical centers across the USA instantly</p>

        <div className="search-box">
          <h2>Find Medical Centers Near You</h2>
          <form onSubmit={handleSearch}>
            <div className="search-row">
              <div className="form-group">
                <label>State</label>
                <div id="state">
                  <select
                    value={selectedState}
                    onChange={e => setSelectedState(e.target.value)}
                    disabled={loadingStates}
                  >
                    <option value="">{loadingStates ? 'Loading...' : 'Select State'}</option>
                    {states.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>City</label>
                <div id="city">
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    disabled={!selectedState || loadingCities}
                  >
                    <option value="">{loadingCities ? 'Loading...' : 'Select City'}</option>
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                id="searchBtn"
                className="search-btn"
                disabled={!selectedState || !selectedCity}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="features">
        <h2>Why Choose MedCare?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Verified Centers</h3>
            <p>All medical centers are verified and rated by real patients for quality assurance.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Easy Booking</h3>
            <p>Book appointments in seconds with our simple calendar and time slot selection.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💊</div>
            <h3>Free Center Visit</h3>
            <p>Your first center visit consultation is completely free with no hidden charges.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;