import React from 'react';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h1 className="content-title">Farm Manager Dashboard</h1>
        <div className="content-actions">
          <Link to="/cattle/add" className="btn btn-primary">
            Add Cattle
          </Link>
          <Link to="/tasks" className="btn btn-secondary">
            View Tasks
          </Link>
        </div>
      </div>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>🐄 Cattle Management</h3>
          <p>View, add, and manage all cattle records and herd health.</p>
          <Link to="/cattle" className="btn btn-primary">View Cattle</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📋 Task Management</h3>
          <p>Assign, monitor, and track completion of farm tasks.</p>
          <Link to="/tasks" className="btn btn-primary">View Tasks</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📊 Reports & Analytics</h3>
          <p>Generate and review farm performance and production reports.</p>
          <Link to="/reports" className="btn btn-primary">View Reports</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📈 Financial Data</h3>
          <p>Analyze farm finances, view income/expenses, and monitor profitability.</p>
          <Link to="/analytics" className="btn btn-primary">View Analytics</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🔲 QR Code Generator</h3>
          <p>Create QR codes for cattle and equipment identification.</p>
          <Link to="/qr-generator" className="btn btn-primary">Generate QR Codes</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🔍 QR Code Scanner</h3>
          <p>Scan QR codes to access cattle and equipment information.</p>
          <Link to="/qr-scanner" className="btn btn-primary">Scan QR Codes</Link>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
