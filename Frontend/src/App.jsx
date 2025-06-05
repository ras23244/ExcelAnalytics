import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadExcel from './components/UploadExcel';
import DataAnalysis from './components/DataAnalysis';
import ChartGenerator from './components/ChartGenerator';
import AnalysisHistory from './components/AnalysisHistory';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadExcel />} />
            <Route path="/analysis" element={<DataAnalysis />} />
            <Route path="/chart-generator" element={<ChartGenerator />} />
            <Route path="/history" element={<AnalysisHistory />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;