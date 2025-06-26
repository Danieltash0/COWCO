import React from 'react';
import QRGenerator from '../../components/QRGenerator';
import styles from '../../styles/QR.module.css';

const QRGeneratorPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>QR Code Generator</h1>
        <p>Generate QR codes for your cattle to easily access their profiles</p>
      </div>
      <QRGenerator />
    </div>
  );
};

export default QRGeneratorPage;
