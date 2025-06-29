import React from 'react';
import CameraQRScanner from '../../components/CameraQRScanner';
import styles from '../../styles/QR.module.css';

const QRScannerPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>QR Code Scanner</h1>
        <p>Scan QR codes using your camera to quickly access cattle information</p>
      </div>
      <CameraQRScanner />
    </div>
  );
};

export default QRScannerPage;
