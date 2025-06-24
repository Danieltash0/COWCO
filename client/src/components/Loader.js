import React from 'react';
import '../styles/Loader.module.css';

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className={`loader-container ${size}`}>
      <div className="spinner"></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader; 