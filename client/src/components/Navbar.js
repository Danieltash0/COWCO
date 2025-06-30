import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Navbar.module.css';
import logo from '../assets/logo.png.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Top row with brand and user info */}
        <div className={styles.navTopRow}>
          <div className={styles.navBrand}>
            <Link to={getDashboardLink()}>
              <div className={styles.brandContent}>
                <img src={logo} alt="CowCo Logo" className={styles.brandLogo} />
                <h2>CowCo</h2>
              </div>
            </Link>
          </div>

          <div className={styles.navUser}>
            <span className={styles.userName}>{user?.name}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>

        {/* Bottom row with navigation menu */}
        <div className={styles.navMenu}>
          {user?.role === 'Veterinarian' ? (
            <Link to="/appointments" className={styles.navLink}>
              Appointments
            </Link>
          ) : (
            <Link to="/cattle" className={styles.navLink}>
              Cattle
            </Link>
          )}
          
          {user?.role === 'Veterinarian' && (
            <>
              <Link to="/health-records" className={styles.navLink}>
                Health Records
              </Link>
            </>
          )}

          {(user?.role === 'Farm Manager' || user?.role === 'Worker') && (
            <Link to="/tasks" className={styles.navLink}>
              Tasks
            </Link>
          )}

          {user?.role === 'Worker' && (
            <Link to="/milking" className={styles.navLink}>
              Milking
            </Link>
          )}

          {(user?.role === 'Farm Manager' || user?.role === 'Admin') && (
            <>
              <Link to="/reports" className={styles.navLink}>
                Reports
              </Link>
              <Link to="/analytics" className={styles.navLink}>
                Analytics
              </Link>
            </>
          )}

          {(user?.role === 'Farm Manager' || user?.role === 'Admin') && (
            <Link to="/qr-generator" className={styles.navLink}>
              QR Generator
            </Link>
          )}
          
          <Link to="/qr-scanner" className={styles.navLink}>
            QR Scanner
          </Link>

          {user?.role === 'Admin' && (
            <>
              <Link to="/users" className={styles.navLink}>
                Users
              </Link>
              <Link to="/logs" className={styles.navLink}>
                Logs
              </Link>
              <Link to="/settings" className={styles.navLink}>
                Settings
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
