import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaUpload, FaDatabase, FaHistory, FaCog } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
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
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <MdDashboard /> Dashboard
        </NavLink>
        <NavLink to="/upload" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaUpload /> Upload Excel
        </NavLink>
        <NavLink to="/analysis" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaDatabase /> Data Analysis
        </NavLink>
        <NavLink to="/chart-generator" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaChartBar /> Chart Generator
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaHistory /> Analysis History
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaCog /> Admin Panel
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;