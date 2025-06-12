import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartBar,
  FaUpload,
  FaDatabase,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "./Sidebar.css";
import { UserDataContext } from "../context/userContext";

function Sidebar() {
  const { user } = useContext(UserDataContext);
  const token = localStorage.getItem("token");
  const isLoggedIn = user && user.email && token;
  const isAdmin = user && user.role === "admin";
   
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
        className={`sidebar-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={closeMobileMenu}
      ></div>

      <div className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="logo">
          <FaChartBar className="logo-icon" />
          <h2>ExcelHub</h2>
        </div>
        {isLoggedIn && (
          <div className="user-info">
            <div className="avatar">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="user-detail">
              <h3>{user?.name || "User"}</h3>
              <p>{user?.role === "admin" ? "Admin" : "User"}</p>
            </div>
          </div>
        )}
        <nav className="nav-menu">
          {!isLoggedIn && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={closeMobileMenu}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={closeMobileMenu}
              >
                Signup
              </NavLink>
            </>
          )}
          {isLoggedIn && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={closeMobileMenu}
              >
                <MdDashboard /> Dashboard
              </NavLink>
              <NavLink
                to="/upload"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={closeMobileMenu}
              >
                <FaUpload /> Upload Excel
              </NavLink>
              <NavLink
                to="/chart-generator"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={closeMobileMenu}
              >
                <FaChartBar /> Chart Generator
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={closeMobileMenu}
              >
                <FaHistory /> Chart History
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? "nav-item active" : "nav-item"
                  }
                  onClick={closeMobileMenu}
                >
                  <FaCog /> Admin Panel
                </NavLink>
              )}
              <NavLink
                to="/signout"
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={closeMobileMenu}
              >
                <FaSignOutAlt /> Sign Out
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;

