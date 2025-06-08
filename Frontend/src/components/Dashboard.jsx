import React from 'react';
import { FaFileUpload, FaChartLine, FaDatabase, FaDownload } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {

  return (
    <div className="dashboard">
      <div className="welcome-banner">
        <h1>Welcome back, John!</h1>
        <p>Ready to analyze your Excel data? Let's create some amazing insights.</p>
        <button className="new-analysis-btn">
          <FaFileUpload /> New Analysis
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon upload">
            <FaFileUpload />
          </div>
          <div className="stat-info">
            <h3>Total Uploads</h3>
            <div className="stat-value">24</div>
            <div className="stat-change positive">+12% from last month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon charts">
            <FaChartLine />
          </div>
          <div className="stat-info">
            <h3>Charts Generated</h3>
            <div className="stat-value">67</div>
            <div className="stat-change positive">+18% from last month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon data">
            <FaDatabase />
          </div>
          <div className="stat-info">
            <h3>Data Points Analyzed</h3>
            <div className="stat-value">12.4K</div>
            <div className="stat-change positive">+24% from last month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon downloads">
            <FaDownload />
          </div>
          <div className="stat-info">
            <h3>Downloads</h3>
            <div className="stat-value">89</div>
            <div className="stat-change positive">+7% from last month</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-analyses">
          <h2>Recent Analysis</h2>
          <div className="empty-state">
            <FaFileUpload className="empty-icon" />
            <p>No analyses yet. Upload your first Excel file to get started!</p>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">
              <FaFileUpload /> Upload New File
            </button>
            <button className="action-btn">
              <FaChartLine /> Create Chart
            </button>
            <button className="action-btn">
              <FaDatabase /> Export Data
            </button>
            <button className="action-btn">
              <FaDownload /> Share Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;