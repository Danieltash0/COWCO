import React from 'react';
import { Link } from 'react-router-dom';

const WorkerDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h1 className="content-title">Worker Dashboard</h1>
      </div>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>📋 Task Management</h3>
          <p>View and update your assigned tasks and checklists.</p>
          <Link to="/tasks" className="btn btn-primary">View Tasks</Link>
        </div>
      
        <div className="dashboard-card">
          <h3>🐄 Cattle List</h3>
          <p>Access cattle details for daily care and feeding.</p>
          <Link to="/cattle" className="btn btn-primary">View Cattle</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🔲 QR Code Scanner</h3>
          <p>Scan QR codes for quick access to cattle and equipment info.</p>
          <Link to="/qr-scanner" className="btn btn-primary">Scan QR Codes</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🥛 Milking Records</h3>
          <p>Record and review milk production and schedules.</p>
          <Link to="/milking" className="btn btn-primary">View Milk Records</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📊 Task Progress</h3>
          <p>Track your task completion and productivity.</p>
          <Link to="/tasks" className="btn btn-primary">View Progress</Link>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
