import React, { useState } from 'react';
import { FaFileUpload, FaFile } from 'react-icons/fa';
import axios from 'axios';
import './UploadExcel.css';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../context/DataContext'; // <-- import context

const url = "https://excelanalytics-backend.onrender.com";

function UploadExcel() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [recordId, setRecordId] = useState(null);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { uploads, setUploads } = useDataContext(); 

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
    if (
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel'
    ) {
      setSelectedFile(file);
      
    } else {
      alert('Please upload only Excel files (.xlsx or .xls)');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError('');
    setPreviewData(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await axios.post(`${url}/data/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.status === 201 && res.data && res.data.recordId) {
        setUploaded(true);
        setRecordId(res.data.recordId);
        if (res.data.data && Array.isArray(res.data.data)) {
          setPreviewData(res.data.data.slice(0, 5));
        } else if (res.data.rowCount && res.data.rowCount > 0) {
          setPreviewData([{ info: `File uploaded. ${res.data.rowCount} rows saved.` }]);
        } else {
          setPreviewData([{ info: 'File uploaded successfully.' }]);
        }
       
        const newUpload = {
          _id: res.data.recordId,
          fileName: selectedFile.name,
          size: selectedFile.size,
          uploadedAt: new Date().toISOString(),
          data: res.data.data || [],
        };
        if (uploads && Array.isArray(uploads)) {
          setUploads([newUpload, ...uploads]);
        } else {
          setUploads([newUpload]);
        }
        // ------------------------------------
      } else {
        setUploadError('Upload failed.');
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed.');
    }
    setUploading(false);
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

          <button
            className={`analyze-button ${uploaded ? 'uploaded' : ''}`}
            type="button"
            onClick={handleUpload}
            disabled={uploading || uploaded}
          >
            {uploading ? 'Uploading...' : uploaded ? 'Uploaded' : 'Upload File'}
          </button>

          {uploaded && (
            <button
              className="generate-chart-button"
              type="button"
              onClick={() =>navigate(`/chart-generator?recordId=${recordId}`)}
              style={{
                marginTop: '1rem',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Generate Chart
            </button>
          )}
        </div>
      )}

      {uploadError && <div style={{ color: 'red', marginTop: '1rem' }}>{uploadError}</div>}

      {previewData && (
        <div style={{ marginTop: '1.5rem', background: '#fff', borderRadius: 8, padding: 16 }}>
          <h4>Preview</h4>
          {Array.isArray(previewData) && previewData.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {Object.keys(previewData[0]).map((key) => (
                    <th key={key} style={{ borderBottom: '1px solid #eee', padding: 4, textAlign: 'left' }}>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, i) => (
                      <td key={i} style={{ borderBottom: '1px solid #f5f5f5', padding: 4 }}>
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>{previewData[0]?.info}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadExcel;
