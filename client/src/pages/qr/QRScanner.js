import React from 'react';
import QRScanner from '../../components/QRScanner';
import styles from '../../styles/QR.module.css';

const QRScannerPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>QR Code Scanner</h1>
        <p>Scan QR codes to quickly access cattle information</p>
      </div>
      <QRScanner />
    </div>
  );
};

export default QRScannerPage;
