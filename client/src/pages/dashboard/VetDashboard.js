import React from 'react';
import { Link } from 'react-router-dom';

const VetDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h1 className="content-title">Veterinarian Dashboard</h1>
      </div>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>📅 Scheduled Appointments</h3>
          <p>View and manage upcoming cattle health appointments.</p>
          <Link to="/appointments" className="btn btn-primary">View Appointments</Link>
        </div>

        <div className="dashboard-card">
          <h3>📋 Health Records</h3>
          <p>Access and update cattle health and medical records.</p>
          <Link to="/health-records" className="btn btn-primary">View Records</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🐄 Cattle Details</h3>
          <p>Monitor cattle health status and review their related information.</p>
          <Link to="/cattle" className="btn btn-primary">View Cattle</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🔲 QR Code Scanner</h3>
          <p>Scan QR codes to quickly access cattle health records.</p>
          <Link to="/qr-scanner" className="btn btn-primary">Scan QR Codes</Link>
        </div>
      </div>
    </div>
  );
};

export default VetDashboard;
