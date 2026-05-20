import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">Med<span>Care</span></Link>
      <ul className="nav-links">
        <li><a href="#find-doctors">Find Doctors</a></li>
        <li><a href="#hospitals">Hospitals</a></li>
        <li><a href="#medicines">Medicines</a></li>
        <li><a href="#consultations">Consultations</a></li>
      </ul>
      <div className="nav-right">
        <Link to="/my-bookings" className="btn-outline">My Bookings</Link>
      </div>
    </nav>
  );
}

export default Navbar;