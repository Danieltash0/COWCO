import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCattle } from '../../api/useCattle';
import Loader from '../../components/Loader';
import '../../styles/QR.module.css';

const CattleQR = () => {
  const { id } = useParams();
  const { getCattleById } = useCattle();
  const [cattle, setCattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCattle = () => {
      const cattleData = getCattleById(id);
      if (cattleData) {
        setCattle(cattleData);
      } else {
        setError('Cattle not found');
      }
      setLoading(false);
    };

    fetchCattle();
  }, [id, getCattleById]);

  const generateQRCode = () => {
    // This would typically use a QR code library like qrcode.react
    // For now, we'll create a simple placeholder
    const qrData = `${window.location.origin}/cattle/${id}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = generateQRCode();
    link.download = `qr-${cattle.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;
  if (!cattle) return <div className="error">Cattle not found</div>;

  return (
    <div className="qr-container">
      <div className="qr-header">
        <h2>QR Code for {cattle.name}</h2>
        <Link to={`/cattle/${id}`} className="btn btn-secondary">Back to Profile</Link>
      </div>

      <div className="qr-content">
        <div className="qr-info">
          <h3>Cattle Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>ID:</label>
              <span>{cattle.id}</span>
            </div>
            <div className="info-item">
              <label>Name:</label>
              <span>{cattle.name}</span>
            </div>
            <div className="info-item">
              <label>Breed:</label>
              <span>{cattle.breed}</span>
            </div>
            <div className="info-item">
              <label>Location:</label>
              <span>{cattle.location}</span>
            </div>
          </div>
        </div>

        <div className="qr-display">
          <h3>QR Code</h3>
          <div className="qr-code-container">
            <img 
              src={generateQRCode()} 
              alt={`QR Code for ${cattle.name}`}
              className="qr-code"
            />
          </div>
          <p className="qr-description">
            Scan this QR code to quickly access {cattle.name}'s profile
          </p>
          <button onClick={downloadQR} className="btn btn-primary">
            Download QR Code
          </button>
        </div>
      </div>

      <div className="qr-instructions">
        <h3>Instructions</h3>
        <ul>
          <li>Print this QR code and attach it to the cattle's stall or tag</li>
          <li>Use the QR scanner in the app to quickly access cattle information</li>
          <li>Share this QR code with authorized personnel for easy access</li>
        </ul>
      </div>
    </div>
  );
};

export default CattleQR;
