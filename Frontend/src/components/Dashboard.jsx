import React, { useEffect, useState, useContext } from 'react';
import { FaFileUpload, FaChartLine, FaDatabase, FaDownload } from 'react-icons/fa';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/userContext';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  const [stats, setStats] = useState({ uploads: 0, charts: 0, downloads: 0 });
  const [loading, setLoading] = useState(true);
  const [recentCharts, setRecentCharts] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        // Get uploads
        const uploadsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/my-uploads`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
          withCredentials: true
        });
        // Get charts
        const chartsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/chart/my-charts`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
          withCredentials: true
        });
        setStats({
          uploads: uploadsRes.data.length || 0,
          charts: chartsRes.data.length || 0,
          downloads: 0 // Replace with real value if you have downloads tracking
        });
        setRecentUploads(uploadsRes.data.slice(0, 3));
        setRecentCharts(chartsRes.data.slice(0, 3));
      } catch (err) {
        setStats({ uploads: 0, charts: 0, downloads: 0 });
        setRecentUploads([]);
        setRecentCharts([]);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <div className="welcome-banner">
        <h1>Welcome back, {user.name}!</h1>
        <p>Ready to analyze your Excel data? Let's create some amazing insights.</p>
        <button className="new-analysis-btn" onClick={() => navigate('/upload')}>
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
            <div className="stat-value">{loading ? '...' : stats.uploads}</div>
            {/* You can add a real stat-change if you track it */}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon charts">
            <FaChartLine />
          </div>
          <div className="stat-info">
            <h3>Charts Generated</h3>
            <div className="stat-value">{loading ? '...' : stats.charts}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon downloads">
            <FaDownload />
          </div>
          <div className="stat-info">
            <h3>Downloads</h3>
            <div className="stat-value">{loading ? '...' : stats.downloads}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-analyses">
          <h2>Recent Analysis</h2>
          {recentUploads.length === 0 && recentCharts.length === 0 ? (
            <div className="empty-state">
              <FaFileUpload className="empty-icon" />
              <p>No analyses yet. Upload your first Excel file to get started!</p>
            </div>
          ) : (
            <div className="history-list">
              {recentUploads.map(file => (
                <div key={file._id} className="history-item file-item">
                  <div className="item-info">
                    <h3>{file.fileName}</h3>
                    <span className="item-date">Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <button
                    className="download-btn"
                    onClick={() => navigate(`/chart-generator?recordId=${file._id}`)}
                  >
                    <FaDownload style={{marginRight: 4}}/>
                    Generate chart
                  </button>
                  {/* Associated charts */}
                  {recentCharts.filter(chart => {
                    const fileId = typeof chart.excelRecordId === 'object' && chart.excelRecordId !== null
                      ? chart.excelRecordId._id
                      : chart.excelRecordId;
                    return fileId === file._id;
                  }).length > 0 && (
                    <div className="chart-list">
                      {recentCharts.filter(chart => {
                        const fileId = typeof chart.excelRecordId === 'object' && chart.excelRecordId !== null
                          ? chart.excelRecordId._id
                          : chart.excelRecordId;
                        return fileId === file._id;
                      }).map(chart => (
                        <div key={chart._id} className="history-item chart-item">
                          <div className="item-info">
                            <h4>{chart.chartTitle || chart.chartType}</h4>
                            <span className="item-date">Created: {new Date(chart.createdAt).toLocaleDateString()}</span>
                            <span className="item-type">Type: {chart.chartType}</span>
                          </div>
                          <button
                            className="preview-btn"
                            onClick={() => {
                              const params = new URLSearchParams({
                                recordId: chart.excelRecordId?._id || chart.excelRecordId,
                                chartType: chart.chartType || '',
                                x: chart.xAxis || '',
                                y: chart.yAxis || '',
                                z: chart.zAxis || '',
                                chartTitle: chart.chartTitle || '',
                              });
                              navigate(`/chart-generator?${params.toString()}`);
                            }}
                          >
                            Preview Chart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;