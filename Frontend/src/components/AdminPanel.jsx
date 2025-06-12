import React, { useEffect, useState } from 'react';
import { FaUsers, FaDatabase, FaChartLine, FaCog, FaTrash, FaFileExcel } from 'react-icons/fa';
import axios from 'axios';
import './AdminPanel.css';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const url = `https://excelanalytics-backend.onrender.com`;
 

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        // Get all users with their files (and optionally stats)
        const res = await axios.get(`${url}/user/admin/users-with-files`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
          withCredentials: true
        });
        setUsers(res.data || []);
      
      } catch (err) {
        setError('Failed to load admin data.');
      }
      setLoading(false);
    };
    fetchAdminData();
  }, []);

  // Delete user handler
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${url}/user/admin/${userId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        withCredentials: true
      });
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  // Delete file handler
  const handleDeleteFile = async (fileId, userId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${url}/user/admin/files/${fileId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        withCredentials: true
      });
      setUsers(users => users.map(user =>
        user._id === userId
          ? { ...user, files: user.files.filter(f => f._id !== fileId) }
          : user
      ));
    } catch (err) {
      alert('Failed to delete file.');
    }
  };

  // Calculate stats
  const totalUsers = users.length;
  const totalFiles = users.reduce((acc, user) => acc + (user.files?.length || 0), 0);
  const totalStorage = users.reduce(
    (acc, user) =>
      acc +
      (user.files
        ? user.files.reduce((sum, file) => sum + (file.size || 0), 0)
        : 0),
    0
  );
  // Format storage (bytes to MB/GB/TB)
  function formatStorage(bytes) {
    if (bytes >= 1e12) return (bytes / 1e12).toFixed(2) + ' TB';
    if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB';
    if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + ' MB';
    if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + ' KB';
    return bytes + ' B';
  }

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
            <div className="stat-value">{totalUsers}</div>
            
            <div className="stat-change positive"></div>
          </div>
        </div>

        <div className="stat-card">
          <FaDatabase className="stat-icon" />
          <div className="stat-info">
            <h3>Storage Used</h3>
            <div className="stat-value">{formatStorage(totalStorage)}</div>
           
            <div className="stat-change">{/* e.g. 75% of limit */}</div>
          </div>
        </div>

        <div className="stat-card">
          <FaChartLine className="stat-icon" />
          <div className="stat-info">
            <h3>Total Files</h3>
            <div className="stat-value">{totalFiles}</div>
            <div className="stat-change positive"></div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="users-table">
          <div className="table-header">
            <h2>User Management</h2>
          </div>
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {users.map(user => (
            <div key={user._id} className="user-section">
              <div className="user-info-row">
                <div className="user-details">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <span className={`role-badge ${user.role?.toLowerCase()}`}>{user.role}</span>
                  <span className={`status-badge ${user.status?.toLowerCase()}`}>{user.status || 'Active'}</span>
                </div>
                <div className="user-actions">
                  <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>Delete User</button>
                </div>
              </div>
              <div className="user-files">
                <h4>Uploaded Files ({user.files?.length || 0})</h4>
                <div className="files-list">
                  {user.files && user.files.map(file => (
                    <div key={file._id} className="file-item">
                      <FaFileExcel className="file-icon" />
                      <div className="file-info">
                        <p>{file.fileName}</p>
                        <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                      </div>
                      <button className="delete-file-btn" onClick={() => handleDeleteFile(file._id, user._id)}>
                        <FaTrash />
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
