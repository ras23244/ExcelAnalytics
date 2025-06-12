import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { FaChartBar, FaChartLine, FaChartPie, FaChartArea, FaChevronDown } from 'react-icons/fa';
import './ChartGenerator.css';
import axios from 'axios';
import { useDataContext } from '../context/DataContext';

  const url = `https://excelanalytics-backend.onrender.com`;

function ChartGenerator() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const recordId = searchParams.get('recordId');
  const chartTypeParam = searchParams.get('chartType');
  const xParam = searchParams.get('x');
  const yParam = searchParams.get('y');
  const zParam = searchParams.get('z');
  const chartTitleParam = searchParams.get('chartTitle');

  // Use context for uploads
  const { uploads, setUploads, charts, setCharts } = useDataContext();

  const [chartType, setChartType] = useState(chartTypeParam || 'bar');
  const [selectedColumns, setSelectedColumns] = useState({
    x: xParam || '',
    y: yParam || '',
    z: zParam || ''
  });
  const [showMoreCharts, setShowMoreCharts] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [excelData, setExcelData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [columnTypes, setColumnTypes] = useState({});
  const [axisSuggestions, setAxisSuggestions] = useState({ x: [], y: [], z: [] });
  const [chartSaved, setChartSaved] = useState(false);
  const [savingChart, setSavingChart] = useState(false);
  const [aiInsights, setAiInsights] = useState('');
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState('');
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    if (!recordId) return;
    setLoading(true);
    setError('');
    const fetchData = async () => {
      // Try to find the file in uploads context
      if (uploads && Array.isArray(uploads)) {
        const found = uploads.find(u => u._id === recordId);
        if (found && found.data && Array.isArray(found.data)) {
          setExcelData(found.data);
          setColumns(Object.keys(found.data[0] || {}));
          setLoading(false);
          return;
        }
      }
      // If not found or no data, fetch from backend
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${url}/data/${recordId}`, {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        if (res.status === 200 && res.data && Array.isArray(res.data.data)) {
          setExcelData(res.data.data);
          setColumns(Object.keys(res.data.data[0] || {}));
          // Optionally, update uploads context with this file's data
          if (uploads && Array.isArray(uploads)) {
            const idx = uploads.findIndex(u => u._id === recordId);
            if (idx !== -1) {
              const updated = [...uploads];
              updated[idx] = { ...updated[idx], data: res.data.data };
              setUploads(updated);
            }
          }
        } else {
          setError('No data found for this record.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data.');
      }
      setLoading(false);
    };
    fetchData();
  }, [recordId, uploads, setUploads]);

  useEffect(() => {
    if (!excelData || columns.length === 0) return;
    // Infer column types: numeric or categorical
    const types = {};
    columns.forEach(col => {
      const values = excelData.map(row => row[col]);
      const numericCount = values.filter(v => !isNaN(parseFloat(v)) && v !== null && v !== '').length;
      types[col] = numericCount > values.length * 0.7 ? 'numeric' : 'categorical';
    });
    setColumnTypes(types);
  }, [excelData, columns]);

  // Suggestion logic
  useEffect(() => {
    if (!columns.length) return;
    const used = Object.values(selectedColumns).filter(Boolean);
    const available = columns.filter(col => !used.includes(col));
    const suggestions = {};
    const config = chartTypeConfig[chartType];
    if (!config) return;
    Object.keys(config).forEach(axis => {
      if (Array.isArray(config[axis])) {
        // Suggest the first compatible available field for each axis
        suggestions[axis] = available.filter(col => config[axis].includes(columnTypes[col]));
      }
    });
    setAxisSuggestions(suggestions);
  }, [selectedColumns, chartType, columns, columnTypes]);

  const basicChartTypes = [
    { id: 'bar', icon: FaChartBar, label: 'Bar Chart' },
    { id: 'line', icon: FaChartLine, label: 'Line Chart' },
    { id: 'pie', icon: FaChartPie, label: 'Pie Chart' },
    { id: 'area', icon: FaChartArea, label: 'Area Chart' }
  ];

  const advancedChartTypes = [
    { id: 'scatter', label: 'Scatter Plot' },
    { id: 'bubble', label: 'Bubble Chart' },
    { id: 'histogram', label: 'Histogram' },
    { id: 'box', label: 'Box Plot' },
    { id: 'violin', label: 'Violin Plot' },
    { id: 'heatmap', label: 'Heatmap' },
    { id: 'contour', label: 'Contour Plot' },
    { id: 'funnel', label: 'Funnel Chart' },
    { id: 'waterfall', label: 'Waterfall Chart' },
    { id: 'sunburst', label: 'Sunburst Chart' },
    { id: 'treemap', label: 'Treemap' },
    { id: 'polar', label: 'Polar Chart' },
    { id: 'radar', label: 'Radar Chart' },
    { id: 'parallel', label: 'Parallel Coordinates' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'scatter3d', label: '3D Scatter' },
    { id: 'line3d', label: '3D Line' },
    { id: 'surface', label: '3D Surface' },
    { id: 'mesh3d', label: '3D Mesh' },
    { id: 'contour3d', label: '3D Contour' },
    { id: 'bubble3d', label: '3D Bubble' },
    { id: 'bar3d', label: '3D Bar' },
    { id: 'volume', label: '3D Volume' }
  ];

  // Chart type configuration: expected data types and Plotly trace types
  const chartTypeConfig = {
    bar: {
      label: 'Bar Chart', icon: FaChartBar, x: ['categorical', 'numeric'], y: ['numeric'], trace: 'bar',
      format: (data, cols) => ({
        x: data.map(item => item[cols.x]),
        y: data.map(item => parseFloat(item[cols.y])),
        type: 'bar',
        marker: { color: '#4361ee' }
      })
    },
    line: {
      label: 'Line Chart', icon: FaChartLine, x: ['categorical', 'numeric'], y: ['numeric'], trace: 'scatter',
      format: (data, cols) => ({
        x: data.map(item => item[cols.x]),
        y: data.map(item => parseFloat(item[cols.y])),
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: '#4361ee' }
      })
    },
    scatter: {
      label: 'Scatter Plot',  x: ['numeric'], y: ['numeric'], trace: 'scatter',
      format: (data, cols) => ({
        x: data.map(item => parseFloat(item[cols.x])),
        y: data.map(item => parseFloat(item[cols.y])),
        type: 'scatter',
        mode: 'markers',
        marker: { color: '#4361ee', size: 8 }
      })
    },
    pie: {
      label: 'Pie Chart', icon: FaChartPie, x: ['categorical'], y: ['numeric'], trace: 'pie',
      format: (data, cols) => ({
        labels: data.map(item => item[cols.x]),
        values: data.map(item => parseFloat(item[cols.y])),
        type: 'pie',
        marker: { colors: [ '#4361ee', '#48bfe3', '#b5179e', '#f72585', '#ffbe0b', '#3a86ff' ] }
      })
    },
    donut: {
      label: 'Donut Chart',  x: ['categorical'], y: ['numeric'], trace: 'pie',
      format: (data, cols) => ({
        labels: data.map(item => item[cols.x]),
        values: data.map(item => parseFloat(item[cols.y])),
        type: 'pie',
        hole: 0.5,
        marker: { colors: [ '#4361ee', '#48bfe3', '#b5179e', '#f72585', '#ffbe0b', '#3a86ff' ] }
      })
    },
    area: {
      label: 'Area Chart', icon: FaChartArea, x: ['categorical', 'numeric'], y: ['numeric'], trace: 'scatter',
      format: (data, cols) => ({
        x: data.map(item => item[cols.x]),
        y: data.map(item => parseFloat(item[cols.y])),
        type: 'scatter',
        fill: 'tozeroy',
        mode: 'lines',
        marker: { color: '#4361ee' }
      })
    },
    bubble: {
      label: 'Bubble Chart',  x: ['numeric'], y: ['numeric'], size: ['numeric'], trace: 'scatter',
      format: (data, cols) => ({
        x: data.map(item => parseFloat(item[cols.x])),
        y: data.map(item => parseFloat(item[cols.y])),
        marker: { size: data.map(item => parseFloat(item[cols.size])), color: '#4361ee', sizemode: 'area' },
        mode: 'markers',
        type: 'scatter'
      })
    },
    histogram: {
      label: 'Histogram',  x: ['numeric'], trace: 'histogram',
      format: (data, cols) => ({
        x: data.map(item => parseFloat(item[cols.x])),
        type: 'histogram',
        marker: { color: '#4361ee' }
      })
    },
    box: {
      label: 'Box Plot', y: ['numeric'], x: ['categorical', 'numeric'], trace: 'box',
      format: (data, cols) => ({
        y: data.map(item => parseFloat(item[cols.y])),
        x: cols.x ? data.map(item => item[cols.x]) : undefined,
        type: 'box',
        marker: { color: '#4361ee' }
      })
    },
    violin: {
      label: 'Violin Plot',  y: ['numeric'], x: ['categorical', 'numeric'], trace: 'violin',
      format: (data, cols) => ({
        y: data.map(item => parseFloat(item[cols.y])),
        x: cols.x ? data.map(item => item[cols.x]) : undefined,
        type: 'violin',
        marker: { color: '#4361ee' }
      })
    },
    heatmap: {
      label: 'Heatmap',  x: ['categorical', 'numeric'], y: ['categorical', 'numeric'], z: ['numeric'], trace: 'heatmap',
      format: (data, cols) => {
        const xVals = [...new Set(data.map(item => item[cols.x]))];
        const yVals = [...new Set(data.map(item => item[cols.y]))];
        const zGrid = yVals.map(yv => xVals.map(xv => {
          const found = data.find(item => item[cols.x] === xv && item[cols.y] === yv);
          return found ? parseFloat(found[cols.z]) : null;
        }));
        return {
          x: xVals,
          y: yVals,
          z: zGrid,
          type: 'heatmap',
          colorscale: 'Viridis',
        };
      }
    },
    contour: {
      label: 'Contour Plot', x: ['numeric'], y: ['numeric'], z: ['numeric'], trace: 'contour',
      format: (data, cols) => {
        const xVals = [...new Set(data.map(item => parseFloat(item[cols.x])))];
        const yVals = [...new Set(data.map(item => parseFloat(item[cols.y])))];
        const zGrid = yVals.map(yv => xVals.map(xv => {
          const found = data.find(item => parseFloat(item[cols.x]) === xv && parseFloat(item[cols.y]) === yv);
          return found ? parseFloat(found[cols.z]) : null;
        }));
        return {
          x: xVals,
          y: yVals,
          z: zGrid,
          type: 'contour',
          colorscale: 'Viridis',
        };
      }
    },
    funnel: {
      label: 'Funnel Chart',  x: ['categorical'], y: ['numeric'], trace: 'funnel',
      format: (data, cols) => ({
        x: data.map(item => item[cols.x]),
        y: data.map(item => parseFloat(item[cols.y])),
        type: 'funnel',
        marker: { color: '#4361ee' }
      })
    },
    waterfall: {
      label: 'Waterfall Chart',x: ['categorical'], y: ['numeric'], trace: 'waterfall',
      format: (data, cols) => ({
        x: data.map(item => item[cols.x]),
        y: data.map(item => parseFloat(item[cols.y])),
        type: 'waterfall',
        marker: { color: '#4361ee' }
      })
    },
    sunburst: {
      label: 'Sunburst Chart', path: ['categorical'], values: ['numeric'], trace: 'sunburst',
      format: (data, cols) => ({
        labels: data.map(item => item[cols.path]),
        parents: data.map(() => ''),
        values: data.map(item => parseFloat(item[cols.values])),
        type: 'sunburst',
      })
    },
    treemap: {
      label: 'Treemap', path: ['categorical'], values: ['numeric'], trace: 'treemap',
      format: (data, cols) => ({
        labels: data.map(item => item[cols.path]),
        parents: data.map(() => ''),
        values: data.map(item => parseFloat(item[cols.values])),
        type: 'treemap',
      })
    },
    polar: {
      label: 'Polar Chart',  theta: ['numeric'], r: ['numeric'], trace: 'scatterpolar',
      format: (data, cols) => ({
        theta: data.map(item => parseFloat(item[cols.theta])),
        r: data.map(item => parseFloat(item[cols.r])),
        type: 'scatterpolar',
        mode: 'lines+markers',
        marker: { color: '#4361ee' }
      })
    },
    radar: {
      label: 'Radar Chart',  theta: ['categorical'], r: ['numeric'], trace: 'scatterpolar',
      format: (data, cols) => ({
        theta: data.map(item => item[cols.theta]),
        r: data.map(item => parseFloat(item[cols.r])),
        type: 'scatterpolar',
        fill: 'toself',
        marker: { color: '#4361ee' }
      })
    },
    parallel: {
      label: 'Parallel Coordinates', dimensions: ['numeric'], trace: 'parcoords',
      format: (data, cols) => ({
        type: 'parcoords',
        dimensions: cols.dimensions.map(col => ({
          label: col,
          values: data.map(item => parseFloat(item[col]))
        }))
      })
    },
    timeline: {
      label: 'Timeline', x: ['categorical'], start: ['numeric'], end: ['numeric'], trace: 'timeline',
      format: (data, cols) => ({
        x: data.map(item => item[cols.x]),
        y: data.map(item => item[cols.start]),
        base: data.map(item => item[cols.end]),
        type: 'bar',
        orientation: 'h',
        marker: { color: '#4361ee' }
      })
    },
    scatter3d: {
      label: '3D Scatter', x: ['numeric'], y: ['numeric'], z: ['numeric'], trace: 'scatter3d',
      format: (data, cols) => ({
        x: data.map(item => parseFloat(item[cols.x])),
        y: data.map(item => parseFloat(item[cols.y])),
        z: data.map(item => parseFloat(item[cols.z])),
        type: 'scatter3d',
        mode: 'markers',
        marker: { color: '#4361ee', size: 5 }
      })
    },
    line3d: {
      label: '3D Line', icon: FaChartLine, x: ['numeric'], y: ['numeric'], z: ['numeric'], trace: 'scatter3d',
      format: (data, cols) => ({
        x: data.map(item => parseFloat(item[cols.x])),
        y: data.map(item => parseFloat(item[cols.y])),
        z: data.map(item => parseFloat(item[cols.z])),
        type: 'scatter3d',
        mode: 'lines',
        marker: { color: '#4361ee', size: 5 }
      })
    },
    surface: {
      label: '3D Surface', x: ['numeric'], y: ['numeric'], z: ['numeric'], trace: 'surface',
      format: (data, cols) => {
        const xVals = [...new Set(data.map(item => parseFloat(item[cols.x])))];
        const yVals = [...new Set(data.map(item => parseFloat(item[cols.y])))];
        const zGrid = yVals.map(yv => xVals.map(xv => {
          const found = data.find(item => parseFloat(item[cols.x]) === xv && parseFloat(item[cols.y]) === yv);
          return found ? parseFloat(found[cols.z]) : null;
        }));
        return {
          x: xVals,
          y: yVals,
          z: zGrid,
          type: 'surface',
          colorscale: 'Viridis',
        };
      }
    },
    mesh3d: {
      label: '3D Mesh', x: ['numeric'], y: ['numeric'], z: ['numeric'], trace: 'mesh3d',
      format: (data, cols) => ({
        x: data.map(item => parseFloat(item[cols.x])),
        y: data.map(item => parseFloat(item[cols.y])),
        z: data.map(item => parseFloat(item[cols.z])),
        type: 'mesh3d',
        opacity: 0.7,
        color: '#4361ee'
      })
    },
    contour3d: {
      label: '3D Contour',x: ['numeric'], y: ['numeric'], z: ['numeric'], trace: 'contour3d',
      format: (data, cols) => {
        // Not natively supported in plotly.js, fallback to surface/contour
        const xVals = [...new Set(data.map(item => parseFloat(item[cols.x])))];
        const yVals = [...new Set(data.map(item => parseFloat(item[cols.y])))];
        const zGrid = yVals.map(yv => xVals.map(xv => {
          const found = data.find(item => parseFloat(item[cols.x]) === xv && parseFloat(item[cols.y]) === yv);
          return found ? parseFloat(found[cols.z]) : null;
        }));
        return {
          x: xVals,
          y: yVals,
          z: zGrid,
          type: 'surface',
          colorscale: 'Viridis',
          contours: { z: { show: true, usecolormap: true, highlightcolor: '#ff0000', project: { z: true } } }
        };
      }
    },
    bubble3d: {
      label: '3D Bubble',x: ['numeric'], y: ['numeric'], z: ['numeric'], size: ['numeric'], trace: 'scatter3d',
      format: (data, cols) => ({
        x: data.map(item => parseFloat(item[cols.x])),
        y: data.map(item => parseFloat(item[cols.y])),
        z: data.map(item => parseFloat(item[cols.z])),
        mode: 'markers',
        marker: { size: data.map(item => parseFloat(item[cols.size])), color: '#4361ee', sizemode: 'diameter' },
        type: 'scatter3d'
      })
    },
    bar3d: {
      label: '3D Bar',  x: ['categorical', 'numeric'], y: ['categorical', 'numeric'], z: ['numeric'], trace: 'bar3d',
      format: (data, cols) => {
        // Simulate 3D bar using mesh3d or surface
        const xVals = [...new Set(data.map(item => item[cols.x]))];
        const yVals = [...new Set(data.map(item => item[cols.y]))];
        const zGrid = yVals.map(yv => xVals.map(xv => {
          const found = data.find(item => item[cols.x] === xv && item[cols.y] === yv);
          return found ? parseFloat(found[cols.z]) : 0;
        }));
        return {
          x: xVals,
          y: yVals,
          z: zGrid,
          type: 'surface',
          colorscale: 'Viridis',
        };
      }
    },
    volume: {
      label: '3D Volume',  x: ['numeric'], y: ['numeric'], z: ['numeric'], value: ['numeric'], trace: 'volume',
      format: (data, cols) => {
        // Not natively supported in plotly.js, fallback to mesh3d
        return {
          x: data.map(item => parseFloat(item[cols.x])),
          y: data.map(item => parseFloat(item[cols.y])),
          z: data.map(item => parseFloat(item[cols.z])),
          value: data.map(item => parseFloat(item[cols.value])),
          type: 'mesh3d',
          opacity: 0.5,
          color: '#4361ee'
        };
      }
    }
  };

  const allChartTypes = Object.entries(chartTypeConfig).map(([id, cfg]) => ({ id, ...cfg }));

  const generatePlotData = () => {
    if (!excelData) return null;
    const config = chartTypeConfig[chartType];
    if (!config) return null;
    // Check required columns
    const required = Object.keys(config).filter(k => Array.isArray(config[k]) && config[k].length > 0);
    for (const key of required) {
      if (!selectedColumns[key]) return null;
    }
    // Format data for Plotly
    return [config.format(excelData, selectedColumns)];
  };

  const plotData = generatePlotData();

  const handleChartTypeSelect = (type, is3DChart = false) => {
    setChartType(type);
    setIs3D(is3DChart);
    setSelectedColumns({ x: '', y: '', z: '' }); 
  };

  const handleSaveChart = async () => {
    if (!recordId || !chartType) return;
    setSavingChart(true);
    setChartSaved(false);
    try {
      const token = localStorage.getItem('token');
      // Prepare payload: include only axes that are relevant for the chart type
      const config = chartTypeConfig[chartType];
      const payload = {
        excelRecordId: recordId,
        xAxis: selectedColumns.x || '',
        yAxis: selectedColumns.y || '',
        zAxis: selectedColumns.z || '',
        chartType,
        chartTitle: chartTypeConfig[chartType].label,
      };
      Object.keys(config).forEach(axis => {
        if (Array.isArray(config[axis]) && selectedColumns[axis]) {
          payload[axis + 'Axis'] = selectedColumns[axis];
        }
      });
      const res = await axios.post(`${url}/chart/create`, payload, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        withCredentials: true
      });
      if (res.status === 201 && res.data && res.data.chart) {
        // Update charts in context immediately
        setCharts(prev => prev ? [res.data.chart, ...prev] : [res.data.chart]);
        setChartSaved(true);
      }
    } catch (err) {
      setChartSaved(false);
      alert('Failed to save chart.');
    }
    setSavingChart(false);
  };

  // In the axis selection UI, only show compatible fields for each axis
  const getCompatibleFields = (axis) => {
    const config = chartTypeConfig[chartType];
    if (!config || !config[axis]) return columns;
    return columns.filter(col => config[axis].includes(columnTypes[col]));
  };

  useEffect(() => {
    // If query params change (e.g. user navigates from preview), update state
    if (chartTypeParam && chartType !== chartTypeParam) setChartType(chartTypeParam);
    setSelectedColumns({
      x: xParam || '',
      y: yParam || '',
      z: zParam || ''
    });
    // Optionally, set chart title if you use it in the UI
    // setChartTitle(chartTitleParam || '');
  }, [chartTypeParam, xParam, yParam, zParam]);

  // Fetch AI insights only when button is clicked
  const handleGetInsights = async () => {
    if (!excelData || excelData.length === 0) return;
    setInsightsLoading(true);
    setInsightsError('');
    setAiInsights('');
    setShowInsights(true);
    try {
      const res = await axios.post(
        `${url}/api/insights`,
        { data: excelData.slice(0, 20) },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setAiInsights(res.data.insights);
    } catch (err) {
      setInsightsError('Failed to fetch AI insights.');
    }
    setInsightsLoading(false);
  };

  return (
    <div className="chart-generator">
      <div className="chart-header">
        <h1>Chart Generator</h1>
        <p>Create interactive charts from your Excel data</p>
      </div>

      {/* --- AI Insights Section --- */}
      <div className="ai-insights" style={{ background: '#f6f9ff', border: '1px solid #e0e7ef', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>AI Insights & Chart Suggestions</h3>
        <button
          className="get-insights-btn"
          onClick={handleGetInsights}
          disabled={insightsLoading || !excelData || excelData.length === 0}
          style={{ marginBottom: 12 }}
        >
          {insightsLoading ? 'Getting AI Insights...' : 'Get AI Insights'}
        </button>
        {showInsights && (
          <>
            {insightsLoading && <div>Loading AI insights...</div>}
            {insightsError && <div style={{ color: 'red' }}>{insightsError}</div>}
            {!insightsLoading && !insightsError && aiInsights && (
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#222' }}>{aiInsights}</pre>
            )}
            {!insightsLoading && !insightsError && !aiInsights && (
              <div style={{ color: '#888' }}>AI will suggest insights and chart types here after you click the button.</div>
            )}
          </>
        )}
      </div>
      {/* --- End AI Insights Section --- */}

      {loading && <div>Loading data...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {excelData && (
        <div style={{ marginBottom: 24 }}>
          <h4>Data Preview</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col} style={{ borderBottom: '1px solid #eee', padding: 4, textAlign: 'left' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.slice(0, 5).map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col, i) => (
                    <td key={i} style={{ borderBottom: '1px solid #f5f5f5', padding: 4 }}>{String(row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
                  onClick={() => handleChartTypeSelect(type.id, type.id.includes('3d'))}
                >
                  {/* No icon for advanced charts to avoid import errors */}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="control-section">
          <h2>Select Data</h2>
          <div className="axis-selection">
            {Object.keys(chartTypeConfig[chartType]).filter(axis => Array.isArray(chartTypeConfig[chartType][axis])).map(axis => (
              <div className="axis-control" key={axis}>
                <label>{axis.toUpperCase()} Axis</label>
                <select
                  value={selectedColumns[axis] || ''}
                  onChange={e => setSelectedColumns({ ...selectedColumns, [axis]: e.target.value })}
                >
                  <option value="">Select column</option>
                  {getCompatibleFields(axis).map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                {/* Suggestions for this axis */}
                {axisSuggestions[axis] && axisSuggestions[axis].length > 0 && !selectedColumns[axis] && (
                  <div className="axis-suggestions">
                    <span style={{ color: 'green' }}>Suggestion: </span>
                    {axisSuggestions[axis].map(col => (
                      <button key={col} className="suggestion-btn" style={{ color: 'green' }} onClick={() => setSelectedColumns({ ...selectedColumns, [axis]: col })}>{col}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="chart-display">
        {plotData ? (
          <>
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
            <button
              className="save-chart-btn"
              onClick={handleSaveChart}
              disabled={savingChart || chartSaved}
              style={{ marginTop: 16 }}
            >
              {savingChart ? 'Saving...' : chartSaved ? 'Chart Saved!' : 'Save Chart'}
            </button>
          </>
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
