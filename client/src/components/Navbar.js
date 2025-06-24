import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'Farm Manager':
        return '/dashboard/manager';
      case 'Veterinarian':
        return '/dashboard/vet';
      case 'Worker':
        return '/dashboard/worker';
      case 'Admin':
        return '/dashboard/admin';
      default:
        return '/dashboard/manager';
    }
  };

  const getRoleLinks = () => {
    const baseLinks = [
      { path: '/cattle', label: 'Cattle', icon: '🐄' },
    ];

    switch (user?.role) {
      case 'Farm Manager':
        return [
          ...baseLinks,
          { path: '/tasks', label: 'Tasks', icon: '📋' },
          { path: '/reports', label: 'Reports', icon: '📊' },
          { path: '/analytics', label: 'Analytics', icon: '📈' },
          { path: '/qr-generator', label: 'QR Generator', icon: '📱' },
        ];
      
      case 'Veterinarian':
        return [
          ...baseLinks,
          { path: '/health-records', label: 'Health Records', icon: '🏥' },
          { path: '/health-alerts', label: 'Health Alerts', icon: '⚠️' },
          { path: '/qr-scanner', label: 'QR Scanner', icon: '📱' },
        ];
      
      case 'Worker':
        return [
          ...baseLinks,
          { path: '/tasks', label: 'Tasks', icon: '📋' },
          { path: '/tasks/checklist', label: 'Checklist', icon: '✅' },
          { path: '/qr-scanner', label: 'QR Scanner', icon: '📱' },
        ];
      
      case 'Admin':
        return [
          ...baseLinks,
          { path: '/users', label: 'Users', icon: '👥' },
          { path: '/logs', label: 'Logs', icon: '📝' },
          { path: '/settings', label: 'Settings', icon: '⚙️' },
          { path: '/reports', label: 'Reports', icon: '📊' },
          { path: '/analytics', label: 'Analytics', icon: '📈' },
          { path: '/qr-generator', label: 'QR Generator', icon: '📱' },
        ];
      
      default:
        return baseLinks;
    }
  };

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to={getDashboardLink()} className="navbar-logo">
            🐄 CowCo
          </Link>
        </div>

        {/* Navigation and Menu Container */}
        <div className="navbar-content">
          {/* Desktop Navigation */}
          <div className="navbar-nav">
            <Link 
              to={getDashboardLink()} 
              className={`nav-link ${isActive(getDashboardLink()) ? 'active' : ''}`}
            >
              🏠 Dashboard
            </Link>
            
            {getRoleLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="navbar-menu">
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="user-dropdown">
                  <button 
                    className="user-button"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span className="user-avatar">👤</span>
                    <span className="user-name">{user?.name}</span>
                    <span className="user-role">({user?.role})</span>
                  </button>
                  
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <div className="dropdown-item">
                        <strong>{user?.name}</strong>
                        <small>{user?.email}</small>
                      </div>
                      <hr />
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
