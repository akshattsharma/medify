import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showStateList, setShowStateList] = useState(false);
  const [showCityList, setShowCityList] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const stateRef = useRef(null);
  const cityRef = useRef(null);
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

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (stateRef.current && !stateRef.current.contains(e.target)) setShowStateList(false);
      if (cityRef.current && !cityRef.current.contains(e.target)) setShowCityList(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelectState = (s) => {
    setSelectedState(s);
    setStateSearch('');
    setShowStateList(false);
  };

  const handleSelectCity = (c) => {
    setSelectedCity(c);
    setCitySearch('');
    setShowCityList(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedState || !selectedCity) return;
    navigate(`/search?state=${encodeURIComponent(selectedState)}&city=${encodeURIComponent(selectedCity)}`);
  };

  const filteredStates = states.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));
  const filteredCities = cities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

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

              {/* STATE DROPDOWN */}
              <div className="form-group" ref={stateRef}>
                <label>State</label>
                <div id="state" className="custom-dropdown">
                  <div
                    className="dropdown-trigger"
                    onClick={() => { setShowStateList(v => !v); setShowCityList(false); }}
                  >
                    <span>{selectedState || (loadingStates ? 'Loading...' : 'Select State')}</span>
                    <span className="dropdown-arrow">▾</span>
                  </div>
                  {showStateList && (
                    <div className="dropdown-list-wrap">
                      <input
                        type="text"
                        className="dropdown-search"
                        placeholder="Search state..."
                        value={stateSearch}
                        onChange={e => setStateSearch(e.target.value)}
                        autoFocus
                      />
                      <ul className="dropdown-list">
                        {filteredStates.map(s => (
                          <li key={s} onClick={() => handleSelectState(s)}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* CITY DROPDOWN */}
              <div className="form-group" ref={cityRef}>
                <label>City</label>
                <div id="city" className="custom-dropdown">
                  <div
                    className={`dropdown-trigger ${!selectedState ? 'disabled' : ''}`}
                    onClick={() => { if (!selectedState || loadingCities) return; setShowCityList(v => !v); setShowStateList(false); }}
                  >
                    <span>{selectedCity || (loadingCities ? 'Loading...' : 'Select City')}</span>
                    <span className="dropdown-arrow">▾</span>
                  </div>
                  {showCityList && (
                    <div className="dropdown-list-wrap">
                      <input
                        type="text"
                        className="dropdown-search"
                        placeholder="Search city..."
                        value={citySearch}
                        onChange={e => setCitySearch(e.target.value)}
                        autoFocus
                      />
                      <ul className="dropdown-list">
                        {filteredCities.map(c => (
                          <li key={c} onClick={() => handleSelectCity(c)}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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