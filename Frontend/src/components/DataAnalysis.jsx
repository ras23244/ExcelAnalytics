import React, { useState } from 'react';
import { FaTable, FaCalculator, FaChartBar } from 'react-icons/fa';
import './DataAnalysis.css';

function DataAnalysis() {
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [analysisType, setAnalysisType] = useState('summary');

  const dummyColumns = ['Sales', 'Revenue', 'Profit', 'Date', 'Region', 'Product'];

  return (
    <div className="data-analysis">
      <div className="analysis-header">
        <h1>Data Analysis</h1>
        <p>Select your dataset and analyze it using various statistical methods</p>
      </div>

      <div className="analysis-grid">
        <div className="dataset-selection">
          <h2>Select Dataset</h2>
          <div className="dataset-list">
            <div className="dataset-card">
              <FaTable className="dataset-icon" />
              <div className="dataset-info">
                <h3>Sales Report 2024</h3>
                <p>Last modified: 2 hours ago</p>
                <button 
                  className="select-btn"
                  onClick={() => setSelectedDataset('sales-2024')}
                >
                  Select Dataset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="analysis-options">
          <h2>Analysis Options</h2>
          <div className="options-container">
            <div className="column-selection">
              <h3>Select Columns</h3>
              <div className="columns-grid">
                {dummyColumns.map(column => (
                  <label key={column} className="column-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedColumns([...selectedColumns, column]);
                        } else {
                          setSelectedColumns(selectedColumns.filter(col => col !== column));
                        }
                      }}
                    />
                    {column}
                  </label>
                ))}
              </div>
            </div>

            <div className="analysis-type">
              <h3>Analysis Type</h3>
              <div className="analysis-buttons">
                <button
                  className={`analysis-btn ${analysisType === 'summary' ? 'active' : ''}`}
                  onClick={() => setAnalysisType('summary')}
                >
                  <FaCalculator />
                  Summary Statistics
                </button>
                <button
                  className={`analysis-btn ${analysisType === 'correlation' ? 'active' : ''}`}
                  onClick={() => setAnalysisType('correlation')}
                >
                  <FaChartBar />
                  Correlation Analysis
                </button>
              </div>
            </div>
          </div>

          <button className="run-analysis-btn" disabled={!selectedDataset || selectedColumns.length === 0}>
            Run Analysis
          </button>
        </div>

        <div className="analysis-results">
          <h2>Analysis Results</h2>
          <div className="results-container">
            <div className="empty-state">
              <FaCalculator className="empty-icon" />
              <p>Select a dataset and run analysis to see results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataAnalysis;