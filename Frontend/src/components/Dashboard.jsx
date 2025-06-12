import React, { useEffect, useState, useContext } from 'react';
import { FaFileUpload, FaChartLine, FaDownload } from 'react-icons/fa';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/userContext';
import axios from 'axios';
import { useDataContext } from '../context/DataContext';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  const { uploads, setUploads, charts, setCharts } = useDataContext();
  const [stats, setStats] = useState({ uploads: 0, charts: 0, downloads: 0 });
  const [loading, setLoading] = useState(true);
  const [recentCharts, setRecentCharts] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);

    const url = `https://excelanalytics-backend.onrender.com`;

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        let uploadsData = uploads;
        let chartsData = charts;
        const token = localStorage.getItem('token');

        if (!uploadsData) {
          const uploadsRes = await axios.get(`${url}/user/my-uploads`, {
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
            withCredentials: true
          });
          uploadsData = uploadsRes.data;
          setUploads(uploadsData);
        }
        if (!chartsData) {
          const chartsRes = await axios.get(`${url}/chart/my-charts`, {
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
            withCredentials: true
          });
          chartsData = chartsRes.data;
          setCharts(chartsData);
        }
        setStats({
          uploads: uploadsData.length || 0,
          charts: chartsData.length || 0,
          downloads: 0 // Replace with real value if you have downloads tracking
        });
        setRecentUploads(uploadsData.slice(0, 2));
        setRecentCharts(chartsData.slice(0, 2));
      } catch (err) {
        setStats({ uploads: 0, charts: 0, downloads: 0 });
        setRecentUploads([]);
        setRecentCharts([]);
      }
      setLoading(false);
    };
    fetchStats();
  }, [uploads, charts, setUploads, setCharts]);

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
