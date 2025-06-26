import React from 'react';
import '../styles/App.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-contact">
        Contact: 
        <a href="mailto:cowco@gmail.com">cowco@gmail.com</a> |
        <a href="tel:+254711566969">+254 711 566 969 </a> |
        <a href="https://cowco.com" target="_blank" rel="noopener noreferrer">www.cowco.com</a>
      </div>
      <div className="footer-copyright">
         {new Date().getFullYear()} CowCo. Strong Herds, Strong Future.
      </div>
    </div>
  </footer>
);

export default Footer; 