import React, { useState } from 'react';
import { FaFileUpload, FaFile } from 'react-icons/fa';
import './UploadExcel.css';

function UploadExcel() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
        file.type === "application/vnd.ms-excel") {
      setSelectedFile(file);
    } else {
      alert("Please upload only Excel files (.xlsx or .xls)");
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Excel File</h1>
      <p className="upload-description">
        Upload your Excel file (.xlsx or .xls) to start analyzing your data
      </p>

      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="file-input"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
        />
        
        <div className="upload-content">
          <FaFileUpload className="upload-icon" />
          <p>Drag and drop your Excel file here</p>
          <span>or</span>
          <label htmlFor="file-upload" className="browse-button">
            Browse Files
          </label>
        </div>
      </div>

      {selectedFile && (
        <div className="selected-file">
          <FaFile className="file-icon" />
          <div className="file-info">
            <p className="file-name">{selectedFile.name}</p>
            <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button className="analyze-button">
            Analyze Data
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadExcel;