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
          <p>Manage all users, assign roles, and control access. Add, edit, or deactivate users.</p>
          <Link to="/users" className="btn btn-primary">Manage Users</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📊 Financial Analytics</h3>
          <p>Analyze all financial records, view income/expenses, and generate financial reports.</p>
          <Link to="/analytics" className="btn btn-primary">View Analytics</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>🐄 Cattle Management</h3>
          <p>Oversee all cattle records, add/edit cattle, and manage herd data.</p>
          <Link to="/cattle" className="btn btn-primary">Manage Cattle</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>⚙️ System Settings</h3>
          <p>Configure system-wide settings and preferences.</p>
          <Link to="/settings" className="btn btn-primary">System Settings</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📋 Activity Logs</h3>
          <p>Review all user and system activity logs for auditing and security.</p>
          <Link to="/logs" className="btn btn-primary">View Logs</Link>
        </div>
        
        <div className="dashboard-card">
          <h3>📈 Reports & Insights</h3>
          <p>Access and generate comprehensive reports on all farm operations.</p>
          <Link to="/reports" className="btn btn-primary">View Reports</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
