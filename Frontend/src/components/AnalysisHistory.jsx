import React from 'react';
import { FaFileAlt, FaChartBar, FaDownload } from 'react-icons/fa';
import './AnalysisHistory.css';

function AnalysisHistory() {
  const dummyHistory = [
    {
      id: 1,
      fileName: 'Sales_Report_2024.xlsx',
      date: '2024-03-05',
      type: 'Statistical Analysis',
      status: 'Completed'
    },
    {
      id: 2,
      fileName: 'Revenue_Q1.xlsx',
      date: '2024-03-04',
      type: 'Chart Generation',
      status: 'Completed'
    }
  ];

  return (
    <div className="analysis-history">
      <div className="history-header">
        <h1>Analysis History</h1>
        <p>View and manage your previous analyses</p>
      </div>

      <div className="history-filters">
        <input
          type="text"
          placeholder="Search analyses..."
          className="search-input"
        />
        <select className="filter-select">
          <option value="">All Types</option>
          <option value="statistical">Statistical Analysis</option>
          <option value="chart">Chart Generation</option>
        </select>
      </div>

      <div className="history-list">
        {dummyHistory.map(item => (
          <div key={item.id} className="history-item">
            <div className="item-icon">
              {item.type === 'Statistical Analysis' ? <FaFileAlt /> : <FaChartBar />}
            </div>
            <div className="item-info">
              <h3>{item.fileName}</h3>
              <p>{item.type}</p>
              <span className="item-date">{item.date}</span>
            </div>
            <div className="item-status">
              <span className={`status-badge ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>
            <button className="download-btn">
              <FaDownload /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalysisHistory;