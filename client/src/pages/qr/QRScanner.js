import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/QR.module.css';

const QRScanner = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [error, setError] = useState('');
  const [manualInput, setManualInput] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
        setError('');
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      processScannedData(manualInput.trim());
    }
  };

  const processScannedData = (data) => {
    setScannedData(data);
    
    // Extract cattle ID from URL
    const match = data.match(/\/cattle\/([^\/\?]+)/);
    if (match) {
      const cattleId = match[1];
      navigate(`/cattle/${cattleId}`);
    } else {
      setError('Invalid QR code format. Please scan a valid cattle QR code.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // This is a simplified version - in a real app, you'd use a QR code library
        // to decode the image and extract the data
        setError('File upload feature requires QR code decoding library. Please use manual input or camera scanning.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="qr-scanner-container">
      <div className="page-header">
        <h2>QR Code Scanner</h2>
      </div>

      <div className="scanner-instructions">
        <h3>Instructions</h3>
        <ul>
          <li>Point your camera at a cattle QR code</li>
          <li>Or manually enter a cattle ID below</li>
          <li>Scanning will automatically redirect to the cattle profile</li>
        </ul>
      </div>

      <div className="scanner-methods">
        <div className="method-tabs">
          <button 
            className={`method-tab ${scanning ? 'active' : ''}`}
            onClick={scanning ? stopScanning : startScanning}
          >
            {scanning ? 'Stop Camera' : 'Start Camera'}
          </button>
          <button className="method-tab">
            Upload Image
          </button>
        </div>

        {error && (
          <div className="scanner-error">
            {error}
          </div>
        )}

        {scanning && (
          <div className="camera-container">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="camera-feed"
            />
            <div className="scanner-overlay">
              <div className="scanner-frame"></div>
              <p>Position QR code within the frame</p>
            </div>
          </div>
        )}

        <div className="file-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            id="qr-file-input"
            style={{ display: 'none' }}
          />
          <label htmlFor="qr-file-input" className="btn btn-secondary">
            Upload QR Code Image
          </label>
        </div>
      </div>

      <div className="manual-input">
        <h3>Manual Input</h3>
        <form onSubmit={handleManualSubmit} className="manual-form">
          <div className="form-group">
            <label>Cattle ID or URL:</label>
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter cattle ID (e.g., COW001) or full URL"
              className="manual-input-field"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Go to Cattle Profile
          </button>
        </form>
      </div>

      {scannedData && (
        <div className="scan-result">
          <h3>Scan Result</h3>
          <div className="result-content">
            <p><strong>Scanned Data:</strong> {scannedData}</p>
            <button 
              onClick={() => processScannedData(scannedData)}
              className="btn btn-primary"
            >
              Process Result
            </button>
          </div>
        </div>
      )}

      <div className="scanner-help">
        <h3>Help & Troubleshooting</h3>
        <div className="help-grid">
          <div className="help-item">
            <h4>📱 Camera Issues</h4>
            <p>Make sure you've granted camera permissions to the browser</p>
          </div>
          <div className="help-item">
            <h4>🔍 QR Code Not Detected</h4>
            <p>Ensure the QR code is well-lit and clearly visible</p>
          </div>
          <div className="help-item">
            <h4>⌨️ Manual Input</h4>
            <p>You can manually enter cattle ID if scanning doesn't work</p>
          </div>
          <div className="help-item">
            <h4>🔄 Try Again</h4>
            <p>If scanning fails, try stopping and restarting the camera</p>
          </div>
        </div>
      </div>

      <div className="recent-scans">
        <h3>Recent Scans</h3>
        <div className="recent-list">
          <p>No recent scans</p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
