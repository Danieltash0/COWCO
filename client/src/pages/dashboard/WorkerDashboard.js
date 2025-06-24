import React from 'react';
import { Link } from 'react-router-dom';

const WorkerDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h1 className="content-title">Worker Dashboard</h1>
        <div className="content-actions">
          <Link to="/tasks" className="btn btn-primary">
            View Tasks
          </Link>
          <Link to="/tasks/checklist" className="btn btn-secondary">
            Daily Checklist
          </Link>
        </div>
      </div>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>📋 Daily Tasks</h3>
          <p>View and manage your assigned daily tasks, track completion status, and update progress. Stay organized with your farm responsibilities.</p>
          <Link to="/tasks" className="btn btn-primary">View Tasks</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>✅ Daily Checklist</h3>
          <p>Complete your daily checklist items, mark tasks as done, and ensure all routine farm operations are completed efficiently.</p>
          <Link to="/tasks/checklist" className="btn btn-primary">Daily Checklist</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🐄 Cattle Care</h3>
          <p>Access cattle information for feeding, cleaning, and general care tasks. View animal details and care instructions.</p>
          <Link to="/cattle" className="btn btn-primary">View Cattle</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🔲 QR Code Scanner</h3>
          <p>Scan QR codes to quickly identify cattle, equipment, and locations. Streamline your daily operations with quick access to information.</p>
          <Link to="/qr-scanner" className="btn btn-primary">Scan QR Codes</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📱 Mobile Tasks</h3>
          <p>Access your tasks and checklists on mobile devices while working in the field. Update task status and view instructions on the go.</p>
          <Link to="/tasks" className="btn btn-primary">Mobile Tasks</Link>
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
