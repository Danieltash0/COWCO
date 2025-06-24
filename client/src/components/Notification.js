import React, { useState, useEffect } from 'react';
import styles from '../styles/Notification.module.css';

const Notification = ({ 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  variant = 'toast',
  actions = []
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`${styles.notification} ${styles[type]} ${styles[variant]} ${isDismissing ? styles.dismissing : ''}`}>
      <div className={styles.notificationHeader}>
        <h4 className={styles.notificationTitle}>
          <span className={styles.notificationIcon}>{getIcon()}</span>
          {title}
        </h4>
        <button 
          className={styles.notificationClose}
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
      
      {message && (
        <p className={styles.notificationMessage}>{message}</p>
      )}
      
      {actions.length > 0 && (
        <div className={styles.notificationActions}>
          {actions.map((action, index) => (
            <button
              key={index}
              className={`btn ${action.variant || 'btn-primary'}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
      
      {duration > 0 && (
        <div className={styles.notificationProgress}></div>
      )}
    </div>
  );
};

// Notification Container Component
export const NotificationContainer = ({ children }) => {
  return (
    <div className={styles.notificationContainer}>
      {children}
    </div>
  );
};

// Hook for managing notifications
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title, message, options = {}) => {
    return addNotification({ type: 'success', title, message, ...options });
  };

  const showError = (title, message, options = {}) => {
    return addNotification({ type: 'error', title, message, ...options });
  };

  const showWarning = (title, message, options = {}) => {
    return addNotification({ type: 'warning', title, message, ...options });
  };

  const showInfo = (title, message, options = {}) => {
    return addNotification({ type: 'info', title, message, ...options });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default Notification;
