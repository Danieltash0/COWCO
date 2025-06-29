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
          <p>Manage all cattle records, health information, and breeding data. Add new cattle, update records, and track individual animal history.</p>
          <Link to="/cattle" className="btn btn-primary">View Cattle</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📋 Task Management</h3>
          <p>Assign and monitor farm tasks, track completion status, and manage daily operations. Keep your team organized and efficient.</p>
          <Link to="/tasks" className="btn btn-primary">View Tasks</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📊 Reports & Analytics</h3>
          <p>Generate comprehensive farm reports, analyze performance metrics, and track financial data. Make data-driven decisions.</p>
          <Link to="/reports" className="btn btn-primary">View Reports</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📈 Analytics Dashboard</h3>
          <p>View detailed analytics on profits, losses, productivity trends, and operational efficiency. Monitor key performance indicators.</p>
          <Link to="/analytics" className="btn btn-primary">View Analytics</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🔲 QR Code Generator</h3>
          <p>Generate QR codes for cattle identification, equipment tracking, and inventory management. Streamline your identification process.</p>
          <Link to="/qr-generator" className="btn btn-primary">Generate QR Codes</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🔍 QR Code Scanner</h3>
          <p>Scan QR codes to quickly access cattle information, equipment details, and inventory data. Fast and efficient data retrieval.</p>
          <Link to="/qr-scanner" className="btn btn-primary">Scan QR Codes</Link>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
