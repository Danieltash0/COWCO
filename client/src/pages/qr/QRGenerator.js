import React, { useState } from 'react';
import { useCattle } from '../../api/useCattle';
import Loader from '../../components/Loader';
import '../../styles/QR.module.css';

const QRGenerator = () => {
  const { cattle, loading, error } = useCattle();
  const [selectedCattle, setSelectedCattle] = useState('');
  const [qrSize, setQrSize] = useState('200');

  const generateQRCode = (cattleId) => {
    const qrData = `${window.location.origin}/cattle/${cattleId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrData)}`;
  };

  const downloadQR = (cattleId, cattleName) => {
    const link = document.createElement('a');
    link.href = generateQRCode(cattleId);
    link.download = `qr-${cattleId}-${cattleName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllQR = () => {
    cattle.forEach(cow => {
      setTimeout(() => {
        downloadQR(cow.id, cow.name);
      }, 1000); // Delay to prevent browser blocking multiple downloads
    });
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="qr-generator-container">
      <div className="page-header">
        <h2>QR Code Generator</h2>
        <div className="qr-controls">
          <select value={qrSize} onChange={(e) => setQrSize(e.target.value)}>
            <option value="100">100x100</option>
            <option value="200">200x200</option>
            <option value="300">300x300</option>
            <option value="400">400x400</option>
          </select>
          <button onClick={downloadAllQR} className="btn btn-secondary">
            Download All QR Codes
          </button>
        </div>
      </div>

      <div className="qr-instructions">
        <h3>Instructions</h3>
        <ul>
          <li>Select a cattle to generate its QR code</li>
          <li>Choose the QR code size from the dropdown</li>
          <li>Download individual QR codes or all at once</li>
          <li>Print and attach QR codes to cattle stalls or tags</li>
        </ul>
      </div>

      <div className="qr-selection">
        <div className="form-group">
          <label>Select Cattle:</label>
          <select 
            value={selectedCattle} 
            onChange={(e) => setSelectedCattle(e.target.value)}
          >
            <option value="">Choose a cattle...</option>
            {cattle.map(cow => (
              <option key={cow.id} value={cow.id}>
                {cow.name} ({cow.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCattle && (
        <div className="qr-preview">
          <h3>QR Code Preview</h3>
          <div className="qr-display">
            <img 
              src={generateQRCode(selectedCattle)} 
              alt="QR Code Preview"
              className="qr-code-preview"
            />
            <div className="qr-info">
              <p><strong>Cattle ID:</strong> {selectedCattle}</p>
              <p><strong>Cattle Name:</strong> {cattle.find(c => c.id === selectedCattle)?.name}</p>
              <p><strong>QR Size:</strong> {qrSize}x{qrSize} pixels</p>
              <p><strong>URL:</strong> {window.location.origin}/cattle/{selectedCattle}</p>
            </div>
            <button 
              onClick={() => downloadQR(selectedCattle, cattle.find(c => c.id === selectedCattle)?.name)}
              className="btn btn-primary"
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}

      <div className="qr-bulk">
        <h3>Bulk QR Code Generation</h3>
        <div className="cattle-grid">
          {cattle.map(cow => (
            <div key={cow.id} className="cattle-qr-item">
              <div className="cattle-info">
                <h4>{cow.name}</h4>
                <p>ID: {cow.id}</p>
                <p>Breed: {cow.breed}</p>
              </div>
              <div className="qr-mini">
                <img 
                  src={generateQRCode(cow.id)} 
                  alt={`QR Code for ${cow.name}`}
                  className="qr-code-mini"
                />
              </div>
              <button 
                onClick={() => downloadQR(cow.id, cow.name)}
                className="btn btn-secondary"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="qr-usage">
        <h3>QR Code Usage</h3>
        <div className="usage-grid">
          <div className="usage-item">
            <h4>📱 Mobile Scanning</h4>
            <p>Use the QR scanner in the mobile app to quickly access cattle information</p>
          </div>
          <div className="usage-item">
            <h4>🏷️ Physical Tags</h4>
            <p>Print QR codes and attach them to cattle ear tags or stall signs</p>
          </div>
          <div className="usage-item">
            <h4>📋 Inventory Management</h4>
            <p>Scan QR codes during inventory checks and health assessments</p>
          </div>
          <div className="usage-item">
            <h4>👥 Team Access</h4>
            <p>Share QR codes with authorized personnel for easy access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
