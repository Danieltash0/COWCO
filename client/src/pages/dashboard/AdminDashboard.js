import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h1 className="content-title">Admin Dashboard</h1>
        <div className="content-actions">
          <Link to="/users" className="btn btn-primary">
            Manage Users
          </Link>
          <Link to="/settings" className="btn btn-secondary">
            System Settings
          </Link>
        </div>
      </div>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>👥 User Management</h3>
          <p>Manage system users, assign roles, and control access permissions. Add new users, update profiles, and monitor user activity.</p>
          <Link to="/users" className="btn btn-primary">Manage Users</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📊 Financial Analytics</h3>
          <p>Monitor system performance, user activity, and overall farm operations. View comprehensive analytics and generate system reports.</p>
          <Link to="/analytics" className="btn btn-primary">View Analytics</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📋 Activity Logs</h3>
          <p>Review system logs, user activities, and security events. Track all system operations and maintain audit trails.</p>
          <Link to="/logs" className="btn btn-primary">View Logs</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>⚙️ System Settings</h3>
          <p>Configure system settings, manage farm parameters, and customize application behavior. Control system-wide configurations.</p>
          <Link to="/settings" className="btn btn-primary">System Settings</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🐄 Cattle Management</h3>
          <p>Access comprehensive cattle management tools, view all records, and manage farm inventory. Full administrative control over cattle data.</p>
          <Link to="/cattle" className="btn btn-primary">Manage Cattle</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📈 Reports & Insights</h3>
          <p>Generate comprehensive farm reports, analyze performance metrics, and create custom reports. Access all farm data and insights.</p>
          <Link to="/reports" className="btn btn-primary">View Reports</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
