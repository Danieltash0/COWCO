import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useQR } from '../api/useQR';
import { useCattle } from '../api/useCattle';
import styles from '../styles/QR.module.css';

const QRGenerator = ({ cattleId, onClose }) => {
  const [selectedCattle, setSelectedCattle] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const { generateQRCode, getQRCodeByCattleId } = useQR();
  const { cattle, loading: cattleLoading } = useCattle();

  useEffect(() => {
    if (cattleId) {
      const cattle = cattle.find(c => c.cattle_id === parseInt(cattleId));
      setSelectedCattle(cattle);
      
      // Check if QR code already exists
      checkExistingQR(cattleId);
    }
  }, [cattleId, cattle]);

  const checkExistingQR = async (id) => {
    try {
      const result = await getQRCodeByCattleId(id);
      if (result.success && result.qr_code) {
        setQrData(result.qr_code.qr_data);
      }
    } catch (err) {
      console.error('Error checking existing QR:', err);
    }
  };

  const handleGenerateQR = async () => {
    if (!selectedCattle) return;
    
    setGenerating(true);
    setError(null);
    
    try {
      const result = await generateQRCode(selectedCattle.cattle_id);
      if (result.success) {
        setQrData(result.qr_data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to generate QR code');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrData) return;
    
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `qr-${selectedCattle?.tag_number || 'cattle'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleSelectCattle = (e) => {
    const id = parseInt(e.target.value);
    const selected = cattle.find(c => c.cattle_id === id);
    setSelectedCattle(selected);
    setQrData(null);
    
    if (id) {
      checkExistingQR(id);
    }
  };

  if (cattleLoading) {
    return <div className={styles.loading}>Loading cattle data...</div>;
  }

  return (
    <div className={styles.qrGenerator}>
      <div className={styles.header}>
        <h2>QR Code Generator</h2>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.selection}>
          <label htmlFor="cattle-select">Select Cattle:</label>
          <select 
            id="cattle-select" 
            value={selectedCattle?.cattle_id || ''} 
            onChange={handleSelectCattle}
            disabled={!!cattleId}
          >
            <option value="">Choose a cattle...</option>
            {cattle.map(cow => (
              <option key={cow.cattle_id} value={cow.cattle_id}>
                {cow.tag_number} - {cow.name || 'Unnamed'}
              </option>
            ))}
          </select>
        </div>

        {selectedCattle && (
          <div className={styles.cattleInfo}>
            <h3>Cattle Information</h3>
            <p><strong>Tag Number:</strong> {selectedCattle.tag_number}</p>
            <p><strong>Name:</strong> {selectedCattle.name || 'Unnamed'}</p>
            <p><strong>Breed:</strong> {selectedCattle.breed || 'Unknown'}</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.qrSection}>
          {qrData ? (
            <div className={styles.qrDisplay}>
              <h3>Generated QR Code</h3>
              <div className={styles.qrCode}>
                <QRCode 
                  value={qrData}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className={styles.actions}>
                <button 
                  className={styles.downloadButton}
                  onClick={handleDownloadQR}
                >
                  Download QR Code
                </button>
                <button 
                  className={styles.regenerateButton}
                  onClick={handleGenerateQR}
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Regenerate'}
                </button>
              </div>
            </div>
          ) : selectedCattle ? (
            <div className={styles.generateSection}>
              <p>No QR code found for this cattle.</p>
              <button 
                className={styles.generateButton}
                onClick={handleGenerateQR}
                disabled={generating}
              >
                {generating ? 'Generating...' : 'Generate QR Code'}
              </button>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <p>Select a cattle to generate a QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator; 