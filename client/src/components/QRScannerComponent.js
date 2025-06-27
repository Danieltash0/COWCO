import React, { useState } from 'react';
import styles from '../styles/QR.module.css';

const QRScannerComponent = ({ onScan, onError }) => {
  const [qrInput, setQrInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  const handleManualInput = (e) => {
    e.preventDefault();
    if (!qrInput.trim()) {
      setError('Please enter QR code data');
      return;
    }

    try {
      // Try to parse as JSON, if it fails, treat as plain text
      let qrData;
      try {
        qrData = JSON.parse(qrInput);
      } catch {
        qrData = {
          id: `manual_${Date.now()}`,
          type: 'text',
          content: qrInput,
          timestamp: new Date().toISOString()
        };
      }

      onScan(qrData);
      setQrInput('');
      setError(null);
    } catch (err) {
      setError('Invalid QR code data');
      onError && onError(err);
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setError(null);
    // In a real app, this would start camera scanning
    // For now, we'll just show the manual input form
  };

  const handleStopScan = () => {
    setIsScanning(false);
    setError(null);
  };

  return (
    <div className={styles.qrScanner}>
      <div className={styles.scannerHeader}>
        <h3>QR Code Scanner</h3>
        <div className={styles.scannerControls}>
          {!isScanning ? (
            <button 
              className="btn btn-primary" 
              onClick={handleStartScan}
            >
              Start Scanning
            </button>
          ) : (
            <button 
              className="btn btn-secondary" 
              onClick={handleStopScan}
            >
              Stop Scanning
            </button>
          )}
        </div>
      </div>

      {isScanning && (
        <div className={styles.scannerContent}>
          <div className={styles.cameraPlaceholder}>
            <div className={styles.cameraIcon}>📷</div>
            <p>Camera scanning would be active here</p>
            <p className={styles.scannerNote}>
              Note: Due to browser limitations, please use manual input below
            </p>
          </div>

          <div className={styles.manualInput}>
            <h4>Manual QR Code Input</h4>
            <form onSubmit={handleManualInput}>
              <textarea
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="Enter QR code data or JSON content..."
                rows={4}
                className={styles.qrInput}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!qrInput.trim()}
              >
                Scan QR Data
              </button>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.scannerError}>
          <p>Error: {error}</p>
        </div>
      )}

      <div className={styles.scannerInstructions}>
        <h4>Instructions</h4>
        <ul>
          <li>Click "Start Scanning" to begin</li>
          <li>Enter QR code data manually in the text area</li>
          <li>You can enter JSON data or plain text</li>
          <li>Click "Scan QR Data" to process the input</li>
        </ul>
      </div>
    </div>
  );
};

export default QRScannerComponent;
