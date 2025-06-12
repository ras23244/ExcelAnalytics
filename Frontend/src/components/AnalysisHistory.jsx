import React, { useContext, useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import './AnalysisHistory.css';
import { UserDataContext } from '../context/userContext';
import { useDataContext } from '../context/DataContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AnalysisHistory() {
  const { user } = useContext(UserDataContext);
  const { uploads, setUploads, charts, setCharts } = useDataContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

    const url = `https://excelanalytics-backend.onrender.com`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!uploads) {
          const filesRes = await axios.get(`${url}/user/my-uploads`, {
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
            withCredentials: true
          });
          setUploads(filesRes.data || []);
        }
        if (!charts) {
          const chartsRes = await axios.get(`${url}/chart/my-charts`, {
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
            withCredentials: true
          });
          setCharts(chartsRes.data || []);
        }
      } catch (err) {
        setError('Failed to load history.');
      }
      setLoading(false);
    };
    fetchData();
  }, [uploads, charts, setUploads, setCharts]);

  // Group charts by file
  const chartsByFile = {};
  (charts || []).forEach(chart => {
    const fileId = typeof chart.excelRecordId === 'object' && chart.excelRecordId !== null
      ? chart.excelRecordId._id
      : chart.excelRecordId;
    if (!fileId) return;
    if (!chartsByFile[fileId]) chartsByFile[fileId] = [];
    chartsByFile[fileId].push(chart);
  });

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file and all associated charts?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${url}/user/delete-upload/${fileId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        withCredentials: true
      });
      setUploads(prev => prev.filter(f => f._id !== fileId));
      setCharts(prev => prev.filter(c => (c.excelRecordId?._id || c.excelRecordId) !== fileId));
    } catch (err) {
      alert('Failed to delete file.');
    }
  };

  const handleDeleteChart = async (chartId) => {
    if (!window.confirm('Are you sure you want to delete this chart?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${url}/chart/delete/${chartId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        withCredentials: true
      });
      setCharts(prev => prev.filter(c => c._id !== chartId));
    } catch (err) {
      alert('Failed to delete chart.');
    }
  };

  return (
    <div className="analysis-history">
      <div className="history-header">
        <h1>Chart History</h1>
        <p>View and manage your previous analyses</p>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="history-list">
        {(uploads || []).length === 0 && !loading && <div>No uploads found.</div>}
        {(uploads || []).map(file => (
          <div key={file._id} className="history-item file-item">
            <div className="item-info">
              <h3>{file.fileName}</h3>
              <span className="item-date">Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</span>
            </div>
            <button
              className="download-btn"
              onClick={() => {
                const params = new URLSearchParams({ recordId: file._id });
                navigate(`/chart-generator?${params.toString()}`);
              }}
            >
              <FaDownload />
              Generate chart
            </button>
            <button className="delete-btn" onClick={() => handleDeleteFile(file._id)}>
              Delete File
            </button>
            {/* Associated charts */}
            {chartsByFile[file._id] && chartsByFile[file._id].length > 0 && (
              <div className="chart-list">
                {chartsByFile[file._id].map(chart => (
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
                    <button className="delete-btn" onClick={() => handleDeleteChart(chart._id)}>
                      Delete Chart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalysisHistory;
