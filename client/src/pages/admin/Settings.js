import React, { useState } from 'react';
import { useAdmin } from '../../api/useAdmin';
import Loader from '../../components/Loader';
import '../../styles/Admin.module.css';

const Settings = () => {
  const { settings, loading, error, updateSettings, resetSettings } = useAdmin();
  const [form, setForm] = useState({
    farmName: settings?.farmName || '',
    farmAddress: settings?.farmAddress || '',
    contactEmail: settings?.contactEmail || '',
    contactPhone: settings?.contactPhone || '',
    timezone: settings?.timezone || 'UTC',
    dateFormat: settings?.dateFormat || 'MM/DD/YYYY',
    currency: settings?.currency || 'USD',
    language: settings?.language || 'en',
    notifications: {
      email: settings?.notifications?.email || true,
      sms: settings?.notifications?.sms || false,
      push: settings?.notifications?.push || true
    },
    security: {
      sessionTimeout: settings?.security?.sessionTimeout || 30,
      passwordPolicy: settings?.security?.passwordPolicy || 'medium',
      twoFactorAuth: settings?.security?.twoFactorAuth || false
    },
    backup: {
      autoBackup: settings?.backup?.autoBackup || true,
      backupFrequency: settings?.backup?.backupFrequency || 'daily',
      retentionDays: settings?.backup?.retentionDays || 30
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, key] = name.split('.');
      setForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const result = await updateSettings(form);
    setSubmitting(false);
    
    if (result.success) {
      alert('Settings updated successfully!');
    } else {
      alert('Failed to update settings: ' + result.error);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      await resetSettings();
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="settings-container">
      <div className="page-header">
        <h2>System Settings</h2>
        <div className="settings-actions">
          <button onClick={handleReset} className="btn btn-secondary">
            Reset to Default
          </button>
          <button onClick={handleSubmit} className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="settings-tabs">
        <button 
          className={`tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button 
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
        <button 
          className={`tab ${activeTab === 'backup' ? 'active' : ''}`}
          onClick={() => setActiveTab('backup')}
        >
          Backup
        </button>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {activeTab === 'general' && (
          <div className="settings-section">
            <h3>General Settings</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Farm Name *</label>
                <input
                  type="text"
                  name="farmName"
                  value={form.farmName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Farm Address</label>
                <textarea
                  name="farmAddress"
                  value={form.farmAddress}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select name="timezone" value={form.timezone} onChange={handleChange}>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date Format</label>
                <select name="dateFormat" value={form.dateFormat} onChange={handleChange}>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select name="currency" value={form.currency} onChange={handleChange}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Language</label>
                <select name="language" value={form.language} onChange={handleChange}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="settings-section">
            <h3>Notification Settings</h3>
            <div className="form-grid">
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="notifications.email"
                    checked={form.notifications.email}
                    onChange={handleChange}
                  />
                  Email Notifications
                </label>
                <p className="help-text">Receive notifications via email</p>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="notifications.sms"
                    checked={form.notifications.sms}
                    onChange={handleChange}
                  />
                  SMS Notifications
                </label>
                <p className="help-text">Receive notifications via SMS (requires phone number)</p>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="notifications.push"
                    checked={form.notifications.push}
                    onChange={handleChange}
                  />
                  Push Notifications
                </label>
                <p className="help-text">Receive browser push notifications</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="settings-section">
            <h3>Security Settings</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Session Timeout (minutes)</label>
                <select name="security.sessionTimeout" value={form.security.sessionTimeout} onChange={handleChange}>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <div className="form-group">
                <label>Password Policy</label>
                <select name="security.passwordPolicy" value={form.security.passwordPolicy} onChange={handleChange}>
                  <option value="low">Low (6+ characters)</option>
                  <option value="medium">Medium (8+ characters, mixed case)</option>
                  <option value="high">High (10+ characters, special chars)</option>
                </select>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="security.twoFactorAuth"
                    checked={form.security.twoFactorAuth}
                    onChange={handleChange}
                  />
                  Enable Two-Factor Authentication
                </label>
                <p className="help-text">Require 2FA for all users</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="settings-section">
            <h3>Backup Settings</h3>
            <div className="form-grid">
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="backup.autoBackup"
                    checked={form.backup.autoBackup}
                    onChange={handleChange}
                  />
                  Enable Automatic Backups
                </label>
                <p className="help-text">Automatically backup system data</p>
              </div>
              <div className="form-group">
                <label>Backup Frequency</label>
                <select name="backup.backupFrequency" value={form.backup.backupFrequency} onChange={handleChange}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="form-group">
                <label>Retention Period (days)</label>
                <select name="backup.retentionDays" value={form.backup.retentionDays} onChange={handleChange}>
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>

      <div className="settings-info">
        <h3>Settings Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>⚙️ General Settings</h4>
            <p>Configure basic farm information and display preferences</p>
          </div>
          <div className="info-item">
            <h4>🔔 Notifications</h4>
            <p>Control how and when you receive system notifications</p>
          </div>
          <div className="info-item">
            <h4>🔒 Security</h4>
            <p>Manage authentication and security policies</p>
          </div>
          <div className="info-item">
            <h4>💾 Backup</h4>
            <p>Configure automatic backup and data retention settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
