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
          <p>Access your tasks and checklists. Update task status and view instructions for efficient daily operations.</p>
          <Link to="/tasks" className="btn btn-primary">View Tasks</Link>
        </div>
      
        <div className="dashboard-card">
          <h3>🐄 Cattle List</h3>
          <p>Access cattle information for feeding, cleaning, and general care tasks. View animal details and care instructions.</p>
          <Link to="/cattle" className="btn btn-primary">View Cattle</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🔲 QR Code Scanner</h3>
          <p>Scan QR codes to quickly identify cattle, equipment, and locations. Streamline your daily operations with quick access to information.</p>
          <Link to="/qr-scanner" className="btn btn-primary">Scan QR Codes</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🥛 Milking Records</h3>
          <p>Record and track milk production data, view milking schedules, and monitor individual cow performance for optimal dairy management.</p>
          <Link to="/milking" className="btn btn-primary">View Milk Records</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📊 Task Progress</h3>
          <p>Track your task completion progress, view performance metrics, and monitor your productivity throughout the day.</p>
          <Link to="/tasks" className="btn btn-primary">View Progress</Link>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
