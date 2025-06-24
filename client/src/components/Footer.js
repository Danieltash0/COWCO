import React from 'react';
import '../styles/App.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-contact">
        Contact: 
        <a href="mailto:support@cowco.com">support@cowco.com</a> |
        <a href="tel:+1234567890">+1 (234) 567-890</a> |
        <a href="https://cowco.com" target="_blank" rel="noopener noreferrer">www.cowco.com</a>
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} CowCo. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer; 