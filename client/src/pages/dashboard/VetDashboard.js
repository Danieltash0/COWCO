import React from 'react';
import { Link } from 'react-router-dom';

const VetDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h1 className="content-title">Veterinarian Dashboard</h1>
        <div className="content-actions">
          <Link to="/health-records" className="btn btn-primary">
            Health Records
          </Link>
          <Link to="/health-alerts" className="btn btn-secondary">
            Health Alerts
          </Link>
        </div>
      </div>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>🐄 Cattle Health</h3>
          <p>Access comprehensive cattle health records, medical procedure history, and medical treatments. Monitor animal wellness and track health trends.</p>
          <Link to="/cattle" className="btn btn-primary">View Cattle</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📋 Health Records</h3>
          <p>Access cattle health information and medical records. Update records and view patient data for comprehensive health management.</p>
          <Link to="/health-records" className="btn btn-primary">View Records</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>⚠️ Health Alerts</h3>
          <p>Monitor health alerts, urgent cases, and critical health issues. Stay informed about animals requiring immediate attention.</p>
          <Link to="/health-alerts" className="btn btn-primary">View Alerts</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📅 Scheduled Appointments</h3>
          <p>View and manage upcoming health appointments for cattle. Schedule new appointments and review details.</p>
          <Link to="/appointments" className="btn btn-primary">View Appointments</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🔲 QR Code Scanner</h3>
          <p>Scan QR codes to quickly access individual cattle health records and medical history. Efficient patient information retrieval.</p>
          <Link to="/qr-scanner" className="btn btn-primary">Scan QR Codes</Link>
        </div>
      </div>
    </div>
  );
};

export default VetDashboard;
