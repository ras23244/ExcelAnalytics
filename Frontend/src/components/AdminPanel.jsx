import React from 'react';
import { FaUsers, FaDatabase, FaChartLine, FaCog, FaTrash, FaFileExcel } from 'react-icons/fa';
import './AdminPanel.css';

function AdminPanel() {
  const users = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'Premium', 
      status: 'Active',
      files: [
        { id: 1, name: 'Sales_Report_2024.xlsx', uploadDate: '2024-03-05' },
        { id: 2, name: 'Revenue_Q1.xlsx', uploadDate: '2024-03-04' }
      ]
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'Basic', 
      status: 'Active',
      files: [
        { id: 3, name: 'Marketing_Data.xlsx', uploadDate: '2024-03-03' }
      ]
    }
  ];

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage users and monitor system usage</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-info">
            <h3>Total Users</h3>
            <div className="stat-value">256</div>
            <div className="stat-change positive">+12% this month</div>
          </div>
        </div>

        <div className="stat-card">
          <FaDatabase className="stat-icon" />
          <div className="stat-info">
            <h3>Storage Used</h3>
            <div className="stat-value">1.2 TB</div>
            <div className="stat-change">75% of limit</div>
          </div>
        </div>

        <div className="stat-card">
          <FaChartLine className="stat-icon" />
          <div className="stat-info">
            <h3>API Calls</h3>
            <div className="stat-value">45.2K</div>
            <div className="stat-change positive">+8% this month</div>
          </div>
        </div>

        <div className="stat-card">
          <FaCog className="stat-icon" />
          <div className="stat-info">
            <h3>System Status</h3>
            <div className="stat-value">Healthy</div>
            <div className="stat-change">All systems operational</div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="users-table">
          <div className="table-header">
            <h2>User Management</h2>
            <button className="add-user-btn">Add New User</button>
          </div>
          
          {users.map(user => (
            <div key={user.id} className="user-section">
              <div className="user-info-row">
                <div className="user-details">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </div>
                <div className="user-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete User</button>
                </div>
              </div>
              
              <div className="user-files">
                <h4>Uploaded Files ({user.files.length})</h4>
                <div className="files-list">
                  {user.files.map(file => (
                    <div key={file.id} className="file-item">
                      <FaFileExcel className="file-icon" />
                      <div className="file-info">
                        <p>{file.name}</p>
                        <span>{file.uploadDate}</span>
                      </div>
                      <button className="delete-file-btn">
                        <FaTrash /> Delete File
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;