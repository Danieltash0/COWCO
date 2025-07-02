import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { useQR } from '../../api/useQR';
import Loader from '../../components/Loader';
import '../../styles/QR.module.css';

const CattleQR = () => {
  const { id } = useParams();
  const { getQRCodeByCattleId, generateQRCode } = useQR();
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchQR = async () => {
      setLoading(true);
      setError('');
      const result = await getQRCodeByCattleId(id);
      if (result.success && result.qr_code && result.qr_code.qr_data) {
        setQrData(result.qr_code.qr_data);
      } else {
        setQrData(null);
      }
      setLoading(false);
    };
    fetchQR();
  }, [id]);

  const handleGenerateQR = async () => {
    setGenerating(true);
    setError('');
    const result = await generateQRCode(id);
    if (result.success) {
      setQrData(result.qr_data);
    } else {
      setError(result.error || 'Failed to generate QR code');
    }
    setGenerating(false);
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `qr-cattle-${id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="qr-container">
      <div className="qr-header">
        <h2>Cattle QR Code</h2>
        <Link to={`/cattle/${id}`} className="btn btn-secondary">Back to Profile</Link>
      </div>
      <div className="qr-content">
        <div className="qr-display">
          <h3>QR Code</h3>
          <div className="qr-code-container">
            {qrData ? (
              <QRCode value={qrData} size={200} level="H" includeMargin={true} />
            ) : (
              <p>No QR code found for this cattle.</p>
            )}
          </div>
          {qrData && (
            <button onClick={handleDownloadQR} className="btn btn-primary" style={{marginRight: '1rem'}}>
              Download QR Code
            </button>
          )}
          <button onClick={handleGenerateQR} className="btn btn-secondary" disabled={generating}>
            {qrData ? (generating ? 'Regenerating...' : 'Regenerate QR Code') : (generating ? 'Generating...' : 'Generate QR Code')}
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
