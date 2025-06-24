import React from 'react';
import styles from '../styles/QR.module.css';

const QRDisplay = ({ data, title, size = 'medium' }) => {
  // Mock QR code data - in a real app, you would generate actual QR codes
  const mockQRCode = {
    id: data?.id || 'qr_123',
    content: data?.content || JSON.stringify(data),
    type: data?.type || 'text',
    timestamp: new Date().toISOString()
  };

  const handleDownload = () => {
    // Mock download functionality
    console.log('Downloading QR code:', mockQRCode);
    alert('QR code download started!');
  };

  const handlePrint = () => {
    // Mock print functionality
    console.log('Printing QR code:', mockQRCode);
    window.print();
  };

  const handleCopy = () => {
    // Mock copy functionality
    navigator.clipboard.writeText(mockQRCode.content);
    alert('QR code data copied to clipboard!');
  };

  return (
    <div className={styles.qrDisplay}>
      <div className={`${styles.qrCode} ${styles[size]}`}>
        <div className={styles.qrInfo}>
          <h3>{title || 'QR Code'}</h3>
          <p>ID: {mockQRCode.id}</p>
          <p>Type: {mockQRCode.type}</p>
          <p>Generated: {new Date(mockQRCode.timestamp).toLocaleString()}</p>
        </div>
        
        {/* Mock QR code image */}
        <div 
          style={{
            width: size === 'small' ? '100px' : size === 'large' ? '300px' : '200px',
            height: size === 'small' ? '100px' : size === 'large' ? '300px' : '200px',
            backgroundColor: '#000',
            display: 'grid',
            gridTemplateColumns: 'repeat(25, 1fr)',
            gridTemplateRows: 'repeat(25, 1fr)',
            gap: '1px',
            padding: '10px',
            borderRadius: '8px'
          }}
        >
          {Array.from({ length: 625 }, (_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: Math.random() > 0.5 ? '#000' : '#fff',
                width: '100%',
                height: '100%'
              }}
            />
          ))}
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
        <p><strong>Content:</strong> {mockQRCode.content.substring(0, 100)}...</p>
        <p><strong>Size:</strong> {size}</p>
        <p><strong>Format:</strong> PNG</p>
      </div>
    </div>
  );
};

export default QRDisplay;
