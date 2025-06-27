import React from 'react';
import QRCode from 'qrcode.react';
import styles from '../styles/QR.module.css';

const QRDisplay = ({ data, title, size = 'medium' }) => {
  const qrData = data?.content || JSON.stringify(data);
  const qrId = data?.id || `qr_${Date.now()}`;
  const qrType = data?.type || 'text';
  const timestamp = data?.timestamp || new Date().toISOString();

  const handleDownload = () => {
    const canvas = document.querySelector(`#qr-${qrId} canvas`);
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${qrId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrData);
    alert('QR code data copied to clipboard!');
  };

  const getQRSize = () => {
    switch (size) {
      case 'small': return 100;
      case 'large': return 300;
      default: return 200;
    }
  };

  return (
    <div className={styles.qrDisplay}>
      <div className={`${styles.qrCode} ${styles[size]}`}>
        <div className={styles.qrInfo}>
          <h3>{title || 'QR Code'}</h3>
          <p>ID: {qrId}</p>
          <p>Type: {qrType}</p>
          <p>Generated: {new Date(timestamp).toLocaleString()}</p>
        </div>
        
        <div id={`qr-${qrId}`} className={styles.qrCodeContainer}>
          <QRCode 
            value={qrData}
            size={getQRSize()}
            level="M"
            includeMargin={true}
          />
        </div>
      </div>

      <div className={styles.qrActions}>
        <button 
          className="btn btn-primary" 
          onClick={handleDownload}
        >
          Download
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={handlePrint}
        >
          Print
        </button>
        <button 
          className="btn btn-outline" 
          onClick={handleCopy}
        >
          Copy Data
        </button>
      </div>

      <div className={styles.qrInfo}>
        <h4>QR Code Details</h4>
        <p><strong>Content:</strong> {qrData.substring(0, 100)}...</p>
        <p><strong>Size:</strong> {size}</p>
        <p><strong>Format:</strong> PNG</p>
      </div>
    </div>
  );
};

export default QRDisplay;
