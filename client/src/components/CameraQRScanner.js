import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useQR } from '../api/useQR';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/QR.module.css';

console.log('CameraQRScanner rendered');

const CameraQRScanner = ({ onClose, onScan }) => {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showCattleModal, setShowCattleModal] = useState(false);

  const scannerRef = useRef(null);
  const scannerRunning = useRef(false); // Track scanner state
  const { scanQRCode } = useQR();
  const navigate = useNavigate();

  // Start the scanner on mount
  useEffect(() => {
    let isMounted = true;
    const qrRegionId = 'qr-reader';
    let scanner;

    async function startScanner() {
      if (!document.getElementById(qrRegionId)) {
        const qrReaderDiv = document.createElement('div');
        qrReaderDiv.id = qrRegionId;
        qrReaderDiv.className = styles.qrReader;
        document.querySelector(`.${styles.scannerContainer}`)?.appendChild(qrReaderDiv);
      }
      scanner = new Html5Qrcode(qrRegionId);
      scannerRef.current = scanner;
      try {
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          onScanSuccess,
          onScanFailure
        );
        scannerRunning.current = true;
      } catch (err) {
        if (isMounted) setError('Unable to start camera: ' + err.message);
        scannerRunning.current = false;
      }
    }

    if (scanning && !showCattleModal && !error) {
      startScanner();
    }

    return () => {
      isMounted = false;
      if (scannerRef.current && scannerRunning.current) {
        try {
          scannerRef.current.stop().then(() => {
            scannerRef.current.clear();
            scannerRunning.current = false;
          }).catch(() => {
            scannerRunning.current = false;
          });
        } catch (e) {
          scannerRunning.current = false;
        }
      } else if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {}
      }
      // Remove the scanner DOM node
      const qrReader = document.getElementById(qrRegionId);
      if (qrReader && qrReader.parentNode) {
        qrReader.parentNode.removeChild(qrReader);
      }
    };
    // eslint-disable-next-line
  }, [scanning, showCattleModal, error]);

  // Stop scanner when modal is shown, resume when closed
  useEffect(() => {
    if (scannerRef.current) {
      if (showCattleModal && scannerRunning.current) {
        try {
          scannerRef.current.stop().then(() => {
            scannerRunning.current = false;
          }).catch(() => {
            scannerRunning.current = false;
          });
        } catch (e) {
          scannerRunning.current = false;
        }
      } else if (scanning && !error && !scannerRunning.current) {
        try {
          scannerRef.current.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            onScanSuccess,
            onScanFailure
          ).then(() => {
            scannerRunning.current = true;
          }).catch((err) => {
            setError('Unable to start camera: ' + err.message);
            scannerRunning.current = false;
          });
        } catch (e) {
          scannerRunning.current = false;
        }
      }
    }
    // eslint-disable-next-line
  }, [showCattleModal]);

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
    // console.log('QR scan failure:', error);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setProcessing(false);
    setShowCattleModal(false);
    setScanning(true);
  };

  const handleClose = () => {
    if (scannerRef.current && scannerRunning.current) {
      try {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
          scannerRunning.current = false;
          // Remove the scanner DOM node contents
          const qrReader = document.getElementById('qr-reader');
          if (qrReader && qrReader.parentNode) {
            qrReader.parentNode.removeChild(qrReader);
          }
        }).catch(() => {
          scannerRunning.current = false;
        });
      } catch (e) {
        scannerRunning.current = false;
      }
    } else if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (e) {}
      // Remove the scanner DOM node contents
      const qrReader = document.getElementById('qr-reader');
      if (qrReader && qrReader.parentNode) {
        qrReader.parentNode.removeChild(qrReader);
      }
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
    setScanning(true);
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

        {/* Always keep the scanner container in the DOM, just hide it when modal is open or error */}
        <div
          className={styles.scannerContainer}
          style={{ display: showCattleModal || error ? 'none' : 'block' }}
        >
          {/* The qr-reader div will be created and managed by the effect, not rendered here */}
        </div>

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
                    <span className={styles.value}>{result.cattle.date_of_birth}</span>
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
                <button className={styles.primaryButton} onClick={handleViewProfile}>
                  View Profile
                </button>
                <button className={styles.secondaryButton} onClick={handleScanAnother}>
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