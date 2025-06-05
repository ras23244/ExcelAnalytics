import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { FaChartBar, FaChartLine, FaChartPie, FaChartArea, FaChevronDown } from 'react-icons/fa';
import './ChartGenerator.css';

function ChartGenerator() {
  const [chartType, setChartType] = useState('bar');
  const [selectedColumns, setSelectedColumns] = useState({ x: '', y: '', z: '' });
  const [showMoreCharts, setShowMoreCharts] = useState(false);
  const [is3D, setIs3D] = useState(false);

  const dummyData = {
    columns: ['Sales', 'Revenue', 'Profit', 'Month', 'Region'],
    data: [
      { Sales: 100, Revenue: 150, Profit: 50, Month: 'Jan', Region: 'North' },
      { Sales: 120, Revenue: 180, Profit: 60, Month: 'Feb', Region: 'South' },
      { Sales: 90, Revenue: 130, Profit: 40, Month: 'Mar', Region: 'East' },
    ]
  };

  const basicChartTypes = [
    { id: 'bar', icon: FaChartBar, label: 'Bar Chart' },
    { id: 'line', icon: FaChartLine, label: 'Line Chart' },
    { id: 'pie', icon: FaChartPie, label: 'Pie Chart' },
    { id: 'area', icon: FaChartArea, label: 'Area Chart' }
  ];

  const advancedChartTypes = [
    { id: 'scatter3d', icon: FaChartBar, label: '3D Scatter', is3D: true },
    { id: 'surface', icon: FaChartArea, label: '3D Surface', is3D: true },
    { id: 'mesh3d', icon: FaChartLine, label: '3D Mesh', is3D: true }
  ];

  const generatePlotData = () => {
    if (!selectedColumns.x || !selectedColumns.y) return null;

    const x = dummyData.data.map(item => item[selectedColumns.x]);
    const y = dummyData.data.map(item => item[selectedColumns.y]);
    const z = is3D ? dummyData.data.map(item => item[selectedColumns.z]) : undefined;

    return [{
      x,
      y,
      z,
      type: chartType,
      mode: 'markers',
      marker: { color: '#4361ee' }
    }];
  };

  const plotData = generatePlotData();

  const handleChartTypeSelect = (type, is3DChart = false) => {
    setChartType(type);
    setIs3D(is3DChart);
  };

  return (
    <div className="chart-generator">
      <div className="chart-header">
        <h1>Chart Generator</h1>
        <p>Create interactive charts from your Excel data</p>
      </div>

      <div className="chart-controls">
        <div className="control-section">
          <h2>Chart Type</h2>
          <div className="chart-types">
            {basicChartTypes.map(type => (
              <button
                key={type.id}
                className={`chart-type-btn ${chartType === type.id ? 'active' : ''}`}
                onClick={() => handleChartTypeSelect(type.id)}
              >
                <type.icon />
                <span>{type.label}</span>
              </button>
            ))}
          </div>
          
          <button 
            className="show-more-btn"
            onClick={() => setShowMoreCharts(!showMoreCharts)}
          >
            <FaChevronDown className={showMoreCharts ? 'rotated' : ''} />
            {showMoreCharts ? 'Show Less' : 'Show More Charts'}
          </button>

          {showMoreCharts && (
            <div className="advanced-charts">
              {advancedChartTypes.map(type => (
                <button
                  key={type.id}
                  className={`chart-type-btn ${chartType === type.id ? 'active' : ''}`}
                  onClick={() => handleChartTypeSelect(type.id, type.is3D)}
                >
                  <type.icon />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="control-section">
          <h2>Select Data</h2>
          <div className="axis-selection">
            <div className="axis-control">
              <label>X Axis</label>
              <select
                value={selectedColumns.x}
                onChange={(e) => setSelectedColumns({ ...selectedColumns, x: e.target.value })}
              >
                <option value="">Select column</option>
                {dummyData.columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div className="axis-control">
              <label>Y Axis</label>
              <select
                value={selectedColumns.y}
                onChange={(e) => setSelectedColumns({ ...selectedColumns, y: e.target.value })}
              >
                <option value="">Select column</option>
                {dummyData.columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            {is3D && (
              <div className="axis-control">
                <label>Z Axis</label>
                <select
                  value={selectedColumns.z}
                  onChange={(e) => setSelectedColumns({ ...selectedColumns, z: e.target.value })}
                >
                  <option value="">Select column</option>
                  {dummyData.columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="chart-display">
        {plotData ? (
          <Plot
            data={plotData}
            layout={{
              width: 800,
              height: 500,
              title: 'Generated Chart',
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              font: { color: '#2d3748' }
            }}
            config={{ responsive: true }}
          />
        ) : (
          <div className="empty-chart">
            <FaChartBar className="empty-icon" />
            <p>Select columns to generate a chart</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartGenerator;