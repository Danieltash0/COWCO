import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQR } from '../api/useQR';
import styles from '../styles/QR.module.css';

const QRScanner = ({ onClose, onScan }) => {
  const [manualInput, setManualInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  const { scanQRCode } = useQR();
  const navigate = useNavigate();

  const handleManualScan = async (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const scanResult = await scanQRCode(manualInput.trim());
      
      if (scanResult.success) {
        setResult(scanResult);
        
        // If onScan callback is provided, use it
        if (onScan) {
          onScan(scanResult);
        } else {
          // Default behavior: navigate to cattle profile
          navigate(`/cattle/${scanResult.cattle.cattle_id}`);
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

  const handleReset = () => {
    setResult(null);
    setError(null);
    setProcessing(false);
    setManualInput('');
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
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

        {result && (
          <div className={styles.scanResult}>
            <h3>Scan Result</h3>
            <div className={styles.cattleInfo}>
              <p><strong>Tag Number:</strong> {result.cattle.tag_number}</p>
              <p><strong>Name:</strong> {result.cattle.name || 'Unnamed'}</p>
              <p><strong>Breed:</strong> {result.cattle.breed || 'Unknown'}</p>
              <p><strong>Age:</strong> {result.cattle.age || 'Unknown'} years</p>
            </div>
            <div className={styles.actions}>
              <button 
                className={styles.viewButton}
                onClick={() => navigate(`/cattle/${result.cattle.cattle_id}`)}
              >
                View Cattle Profile
              </button>
              <button 
                className={styles.scanAgainButton}
                onClick={handleReset}
              >
                Scan Another QR Code
              </button>
            </div>
          </div>
        )}

        {!result && !error && (
          <div className={styles.scannerContainer}>
            <div className={styles.manualInput}>
              <h3>Manual QR Code Input</h3>
              <p>Enter the QR code data manually:</p>
              
              <form onSubmit={handleManualScan} className={styles.inputForm}>
                <textarea
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Paste QR code data here..."
                  className={styles.qrInput}
                  rows="4"
                  disabled={processing}
                />
                <button 
                  type="submit" 
                  className={styles.scanButton}
                  disabled={processing || !manualInput.trim()}
                >
                  {processing ? 'Processing...' : 'Scan QR Data'}
                </button>
              </form>
            </div>

            <div className={styles.scannerInfo}>
              <h4>QR Code Format</h4>
              <p>The QR code should contain JSON data in this format:</p>
              <pre className={styles.codeExample}>
{`{
  "cattle_id": 1,
  "tag_number": "COW001",
  "name": "Bessie",
  "type": "cattle_profile",
  "url": "/cattle/1"
}`}
              </pre>
            </div>
          </div>
        )}

        {processing && (
          <div className={styles.processing}>
            <p>Processing QR code data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner; 