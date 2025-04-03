import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../css/documentUpload.css';

const DocumentUpload = ({ isLoading, setIsLoading }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection (from input or drop)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') { // Match backend support
        setFile(selectedFile);
        setError('');
        setAnalysisResults(null); // Clear previous results
      } else {
        setError('Please upload a PDF document');
        setFile(null);
      }
    }
  };

  // Drag-and-drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError('');
        setAnalysisResults(null);
      } else {
        setError('Please upload a PDF document');
        setFile(null);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', response.data);
      setAnalysisResults(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('An error occurred while processing the document.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <section id="upload" className="document-upload-section">
      <div className="legal-pattern"></div>
      <div className="containerUpload">
        <div className="section-header">
          <h2>Document Analysis</h2>
          <p className="subtitle">Upload your legal document for AI-powered review</p>
          <div className="divider"></div>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div
            className={`upload-area ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onClick={triggerFileInput}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="document-upload"
              ref={fileInputRef}
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <div className="upload-content">
              {file ? (
                <div className="file-preview">
                  <div className="file-icon">📄</div>
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <button
                    type="button"
                    className="clear-file"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setAnalysisResults(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <div className="upload-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div className="upload-text">
                    <p>Drag & drop your document here</p>
                    <p className="or-text">or</p>
                    <p className="browse-text">Browse files</p>
                  </div>
                  <p className="file-types">Supported format: PDF</p>
                </>
              )}
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className={`analyze-btn ${!file || isLoading ? 'disabled' : ''}`}
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Analyzing Document...
              </>
            ) : (
              <>
                <span>Analyze Document</span>
                <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        {analysisResults && (
          <div className="analysis-results">
            <h3>Analysis Results:</h3>
            {analysisResults.summary && (
              <p>
                <strong>Summary:</strong> {analysisResults.summary}
              </p>
            )}
            {analysisResults.issuesDocUrl && (
              <p>
                <a href={analysisResults.issuesDocUrl} target="_blank" rel="noopener noreferrer">
                  Issues Document
                </a>
              </p>
            )}
            {analysisResults.modifiedDocUrl && (
              <p>
                <a href={analysisResults.modifiedDocUrl} target="_blank" rel="noopener noreferrer">
                  Modified Document
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default DocumentUpload;