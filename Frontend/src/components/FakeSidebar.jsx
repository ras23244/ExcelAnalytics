import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaUpload, FaDatabase, FaHistory, FaCog, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import './Sidebar.css';

function Sidebar({ theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      <div 
        className={`sidebar-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>
      
      <div className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="logo">
          <FaChartBar className="logo-icon" />
          <h2>ExcelHub</h2>
        </div>
        
        <div className="user-info">
          <div className="avatar">JD</div>
          <div className="user-details">
            <h3>John Doe</h3>
            <p>Premium User</p>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            onClick={closeMobileMenu}
          >
            <MdDashboard /> Dashboard
          </NavLink>
          <NavLink 
            to="/upload" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            onClick={closeMobileMenu}
          >
            <FaUpload /> Upload Excel
          </NavLink>
          <NavLink 
            to="/analysis" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            onClick={closeMobileMenu}
          >
            <FaDatabase /> Data Analysis
          </NavLink>
          <NavLink 
            to="/chart-generator" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            onClick={closeMobileMenu}
          >
            <FaChartBar /> Chart Generator
          </NavLink>
          <NavLink 
            to="/history" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            onClick={closeMobileMenu}
          >
            <FaHistory /> Analysis History
          </NavLink>
          <NavLink 
            to="/admin" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            onClick={closeMobileMenu}
          >
            <FaCog /> Admin Panel
          </NavLink>
        </nav>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon className="theme-icon" /> : <FaSun className="theme-icon" />}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </>
  );
}

export default Sidebar;