import React, { useState } from 'react';
import { useAdmin } from '../../api/useAdmin';
import Loader from '../../components/Loader';
import '../../styles/Admin.module.css';

const Logs = () => {
  const { logs, loginLogs, logStats, loading, error, clearOldLogs, exportLogs } = useAdmin();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [showLoginLogs, setShowLoginLogs] = useState(false);

  const handleClearLogs = async () => {
    if (window.confirm('Are you sure you want to clear all logs older than 30 days? This action cannot be undone.')) {
      await clearOldLogs(30);
    }
  };

  const handleExportLogs = async (format) => {
    await exportLogs(format, dateRange.startDate, dateRange.endDate);
  };

  const getLogLevelColor = (action) => {
    if (action?.includes('error') || action?.includes('fail')) return 'red';
    if (action?.includes('warn') || action?.includes('warning')) return 'orange';
    if (action?.includes('login') || action?.includes('logout')) return 'blue';
    if (action?.includes('create') || action?.includes('add')) return 'green';
    if (action?.includes('update') || action?.includes('edit')) return 'yellow';
    if (action?.includes('delete') || action?.includes('remove')) return 'red';
    return 'gray';
  };

  const getLogLevelIcon = (action) => {
    if (action?.includes('error') || action?.includes('fail')) return '❌';
    if (action?.includes('warn') || action?.includes('warning')) return '⚠️';
    if (action?.includes('login')) return '🔐';
    if (action?.includes('logout')) return '🚪';
    if (action?.includes('add') || action?.includes('create')) return '➕';
    if (action?.includes('update') || action?.includes('edit')) return '✏️';
    if (action?.includes('delete') || action?.includes('remove')) return '🗑️';
    if (action?.includes('complete') || action?.includes('finish')) return '✅';
    return '📝';
  };

  const getLogLevel = (action) => {
    if (action?.includes('error') || action?.includes('fail')) return 'ERROR';
    if (action?.includes('warn') || action?.includes('warning')) return 'WARN';
    if (action?.includes('login') || action?.includes('logout')) return 'AUTH';
    return 'INFO';
  };

  const getDisplayLogs = () => {
    const logsToFilter = showLoginLogs ? loginLogs : logs;
    
    return logsToFilter.filter(log => {
      const logLevel = getLogLevel(log.action);
      const matchesFilter = filter === 'all' || logLevel.toLowerCase() === filter;
      const matchesSearch = searchTerm === '' || 
        (log.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (log.action?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      const matchesUser = selectedUser === '' || log.user_id === parseInt(selectedUser);
      
      return matchesFilter && matchesSearch && matchesUser;
    });
  };

  const filteredLogs = getDisplayLogs();

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="logs-container">
      <div className="page-header">
        <h2>System Activity Logs</h2>
        <div className="header-actions">
          <button 
            onClick={() => setShowLoginLogs(!showLoginLogs)} 
            className={`btn ${showLoginLogs ? 'btn-primary' : 'btn-secondary'}`}
          >
            {showLoginLogs ? 'Show All Logs' : 'Show Login Logs'}
          </button>
          <button onClick={handleClearLogs} className="btn btn-danger">
            Clear Old Logs
          </button>
        </div>
      </div>

      <div className="logs-summary">
        <div className="summary-card">
          <h3>Total Logs</h3>
          <div className="summary-count">{logs.length}</div>
        </div>
        <div className="summary-card">
          <h3>Login Events</h3>
          <div className="summary-count blue">{loginLogs.length}</div>
        </div>
        <div className="summary-card">
          <h3>Errors</h3>
          <div className="summary-count red">
            {logs.filter(log => getLogLevel(log.action) === 'ERROR').length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Active Users (7d)</h3>
          <div className="summary-count green">
            {logStats.unique_users || 0}
          </div>
        </div>
      </div>

      <div className="logs-filters">
        <div className="filter-group">
          <label>Filter by Level:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Levels</option>
            <option value="error">Errors</option>
            <option value="warn">Warnings</option>
            <option value="auth">Authentication</option>
            <option value="info">Info</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Date Range:</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label>Export:</label>
          <button onClick={() => handleExportLogs('csv')} className="btn btn-small btn-secondary">
            CSV
          </button>
          <button onClick={() => handleExportLogs('json')} className="btn btn-small btn-secondary">
            JSON
          </button>
        </div>
      </div>

      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Level</th>
              <th>User</th>
              <th>Action</th>
              <th>Description</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-logs">
                  No logs found matching the current filters.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.log_id} className={`log-row ${getLogLevel(log.action).toLowerCase()}`}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>
                    <span className={`log-level ${getLogLevelColor(log.action)}`}>
                      {getLogLevelIcon(log.action)} {getLogLevel(log.action)}
                    </span>
                  </td>
                  <td>{log.user_name || 'System'}</td>
                  <td>{log.action || 'Unknown'}</td>
                  <td className="log-message">{log.description || 'No description'}</td>
                  <td>{log.ip_address || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="logs-info">
        <h3>Log Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>📊 Log Levels</h4>
            <ul>
              <li><strong>Error:</strong> System errors and critical issues</li>
              <li><strong>Warning:</strong> Potential issues and warnings</li>
              <li><strong>Auth:</strong> Login/logout and authentication events</li>
              <li><strong>Info:</strong> General information and user actions</li>
            </ul>
          </div>
          <div className="info-item">
            <h4>🔍 Filtering</h4>
            <ul>
              <li>Filter by log level to focus on specific issues</li>
              <li>Search across messages, users, and actions</li>
              <li>Filter by date range for specific periods</li>
              <li>View only login/logout events</li>
            </ul>
          </div>
          <div className="info-item">
            <h4>📅 Retention</h4>
            <ul>
              <li>Logs are retained for 30 days by default</li>
              <li>Critical errors are kept longer</li>
              <li>Export important logs before clearing</li>
              <li>Automatic cleanup of old logs</li>
            </ul>
          </div>
          <div className="info-item">
            <h4>⚙️ Management</h4>
            <ul>
              <li>Clear old logs to free up storage space</li>
              <li>Export logs for external analysis</li>
              <li>Monitor system health through logs</li>
              <li>Track user activity and security events</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;
