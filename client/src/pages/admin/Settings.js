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
    timezone: settings?.timezone || 'Africa/Nairobi',
    dateFormat: settings?.dateFormat || 'MM/DD/YYYY',
    currency: settings?.currency || 'KSHS',
    language: settings?.language || 'en',
    security: {
      sessionTimeout: settings?.security?.sessionTimeout || 30,
      passwordPolicy: settings?.security?.passwordPolicy || 'medium'
    },
    backup: {
      backupFrequency: settings?.backup?.backupFrequency || 'daily'
    }
  });
  const [submitting, setSubmitting] = useState(false);

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

      <form onSubmit={handleSubmit} className="settings-form">
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
                <option value="Africa/Nairobi">East African Time (EAT)</option>
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
                <option value="KSHS">Kenya Shillings (KSHS)</option>
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
          </div>
        </div>

          <div className="settings-section">
            <h3>Backup Settings</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Backup Frequency</label>
                <select name="backup.backupFrequency" value={form.backup.backupFrequency} onChange={handleChange}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
