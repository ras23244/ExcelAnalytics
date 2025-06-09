import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaUpload, FaDatabase, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import './Sidebar.css';
import { UserDataContext } from '../context/userContext';

function Sidebar() {
  const { user } = useContext(UserDataContext);
  const isLoggedIn = user && user.email;
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="sidebar">
      <div className="logo">
        <FaChartBar className="logo-icon" />
        <h2>ExcelHub</h2>
      </div>
      <div className="user-info">
        <div className="avatar">{user?.name ? user.name[0].toUpperCase() : "U"}</div>
        <div className="user-details">
          <h3>{user?.name || "User"}</h3>
          <p>{user?.role === "admin" ? "Admin" : "User"}</p>
        </div>
      </div>
      <nav className="nav-menu">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <MdDashboard /> Dashboard
        </NavLink>
        {!isLoggedIn && (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              Login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              Signup
            </NavLink>
          </>
        )}
        {isLoggedIn && (
          <>
            <NavLink to="/upload" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <FaUpload /> Upload Excel
            </NavLink>
            
            <NavLink to="/chart-generator" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <FaChartBar /> Chart Generator
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <FaHistory /> Chart History
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <FaCog /> Admin Panel
              </NavLink>
            )}
            <NavLink to="/signout" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <FaSignOutAlt /> Sign Out
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;