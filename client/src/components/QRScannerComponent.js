import React, { useState, useEffect } from 'react';
import styles from '../styles/QR.module.css';

const QRScannerComponent = ({ onScan, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock QR scanner functionality
    // In a real app, you would use a library like react-qr-reader
    const startScanning = () => {
      setIsScanning(true);
      setError(null);
      
      // Simulate scanning process
      setTimeout(() => {
        // Mock successful scan
        const mockQRData = {
          id: 'cattle_123',
          type: 'cattle',
          data: {
            cattleId: 'CTL-2024-001',
            name: 'Bessie',
            breed: 'Holstein',
            age: '3 years'
          }
        };
        
        onScan(mockQRData);
        setIsScanning(false);
      }, 2000);
    };

    if (isScanning) {
      startScanning();
    }
  }, [isScanning, onScan]);

  const handleStartScan = () => {
    setIsScanning(true);
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  return (
    <div className={styles.qrScanner}>
      <div className={styles.qrScannerContainer}>
        {isScanning ? (
          <>
            <div className={styles.qrScannerVideo}>
              <div className={styles.qrScannerOverlay}>
                <div className={styles.qrScannerFrame}></div>
              </div>
            </div>
            <div className={styles.qrScannerStatus}>
              Scanning for QR code...
            </div>
          </>
        ) : (
          <div className={styles.qrScannerVideo}>
            <div className={styles.qrLoading}>
              Click "Start Scan" to begin
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.qrActions}>
        {!isScanning ? (
          <button 
            className="btn btn-primary" 
            onClick={handleStartScan}
          >
            Start Scan
          </button>
        ) : (
          <button 
            className="btn btn-secondary" 
            onClick={handleStopScan}
          >
            Stop Scan
          </button>
        )}
      </div>

      {error && (
        <div className={styles.qrError}>
          <div className={styles.qrErrorIcon}>⚠️</div>
          <div className={styles.qrErrorMessage}>{error}</div>
          <div className={styles.qrErrorActions}>
            <button 
              className="btn btn-primary" 
              onClick={() => setError(null)}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScannerComponent;
