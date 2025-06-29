import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useQR } from '../api/useQR';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/QR.module.css';

const CameraQRScanner = ({ onClose, onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showCattleModal, setShowCattleModal] = useState(false);
  
  const scannerRef = useRef(null);
  const { scanQRCode } = useQR();
  const navigate = useNavigate();

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const startScanner = () => {
    setScanning(true);
    setError(null);
    
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    scanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = scanner;
  };

  const onScanSuccess = async (decodedText, decodedResult) => {
    if (processing) return; // Prevent multiple scans
    
    setProcessing(true);
    setScanning(false);
    
    try {
      const scanResult = await scanQRCode(decodedText);
      
      if (scanResult.success) {
        setResult(scanResult);
        setShowCattleModal(true);
        
        if (onScan) {
          onScan(scanResult);
        }
      } else {
        setError(scanResult.error || 'Invalid QR code data');
      }
    } catch (err) {
      setError('Failed to process QR code data');
      console.error('QR scan error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const onScanFailure = (error) => {
    // Handle scan failure silently - this is normal during scanning
    console.log('QR scan failure:', error);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setProcessing(false);
    setShowCattleModal(false);
    
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    startScanner();
  };

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleViewProfile = () => {
    navigate(`/cattle/${result.cattle.cattle_id}`);
  };

  const handleScanAnother = () => {
    setShowCattleModal(false);
    handleReset();
  };

  return (
    <div className={styles.qrScanner}>
      <div className={styles.header}>
        <h2>QR Code Scanner</h2>
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>
      </div>

      <div className={styles.content}>
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={handleReset}>Try Again</button>
          </div>
        )}

        {!showCattleModal && !error && (
          <div className={styles.scannerContainer}>
            <div className={styles.cameraContainer}>
              <h3>Scan QR Code</h3>
              <p>Position the QR code within the camera view</p>
              <div id="qr-reader" className={styles.qrReader}></div>
            </div>
          </div>
        )}

        {processing && (
          <div className={styles.processing}>
            <p>Processing QR code data...</p>
          </div>
        )}

        {/* Cattle Information Modal */}
        {showCattleModal && result && (
          <div className={styles.modalOverlay}>
            <div className={styles.cattleModal}>
              <div className={styles.modalHeader}>
                <h3>Cattle Information</h3>
                <button 
                  className={styles.closeButton} 
                  onClick={() => setShowCattleModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className={styles.cattleInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Tag Number:</span>
                  <span className={styles.value}>{result.cattle.tag_number}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Name:</span>
                  <span className={styles.value}>{result.cattle.name || 'Unnamed'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Breed:</span>
                  <span className={styles.value}>{result.cattle.breed || 'Unknown'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Health:</span>
                  <span className={styles.value}>{result.cattle.health || 'Unknown'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Gender:</span>
                  <span className={styles.value}>{result.cattle.gender || 'Unknown'}</span>
                </div>
                {result.cattle.date_of_birth && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Date of Birth:</span>
                    <span className={styles.value}>
                      {new Date(result.cattle.date_of_birth).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {result.cattle.notes && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Notes:</span>
                    <span className={styles.value}>{result.cattle.notes}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  className={styles.viewButton}
                  onClick={handleViewProfile}
                >
                  View Full Profile
                </button>
                <button 
                  className={styles.scanAgainButton}
                  onClick={handleScanAnother}
                >
                  Scan Another QR Code
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraQRScanner; 