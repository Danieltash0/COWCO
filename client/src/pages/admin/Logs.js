import React, { useState } from 'react';
import { useAdmin } from '../../api/useAdmin';
import Loader from '../../components/Loader';
import '../../styles/Admin.module.css';

const Logs = () => {
  const { logs, loading, error, clearLogs } = useAdmin();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleClearLogs = async () => {
    if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      await clearLogs();
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return 'red';
      case 'warn': return 'orange';
      case 'info': return 'blue';
      case 'debug': return 'gray';
      default: return 'gray';
    }
  };

  const getLogLevelIcon = (level) => {
    switch (level) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      case 'debug': return '🔍';
      default: return '📝';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="logs-container">
      <div className="page-header">
        <h2>System Logs</h2>
        <button onClick={handleClearLogs} className="btn btn-danger">
          Clear All Logs
        </button>
      </div>

      <div className="logs-summary">
        <div className="summary-card">
          <h3>Total Logs</h3>
          <div className="summary-count">{logs.length}</div>
        </div>
        <div className="summary-card">
          <h3>Errors</h3>
          <div className="summary-count red">
            {logs.filter(log => log.level === 'error').length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Warnings</h3>
          <div className="summary-count orange">
            {logs.filter(log => log.level === 'warn').length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Info</h3>
          <div className="summary-count blue">
            {logs.filter(log => log.level === 'info').length}
          </div>
        </div>
      </div>

      <div className="logs-filters">
        <div className="filter-group">
          <label>Log Level:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Levels</option>
            <option value="error">Errors</option>
            <option value="warn">Warnings</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs..."
            className="search-input"
          />
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
              <th>Message</th>
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
                <tr key={log.id} className={`log-row ${log.level}`}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>
                    <span className={`log-level ${getLogLevelColor(log.level)}`}>
                      {getLogLevelIcon(log.level)} {log.level.toUpperCase()}
                    </span>
                  </td>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td className="log-message">{log.message}</td>
                  <td>{log.ipAddress}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="logs-export">
        <h3>Export Options</h3>
        <div className="export-buttons">
          <button className="btn btn-secondary">
            Export as CSV
          </button>
          <button className="btn btn-secondary">
            Export as JSON
          </button>
          <button className="btn btn-secondary">
            Download Log File
          </button>
        </div>
      </div>

      <div className="logs-info">
        <h3>Log Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>📊 Log Levels</h4>
            <ul>
              <li><strong>Error:</strong> System errors and critical issues</li>
              <li><strong>Warning:</strong> Potential issues and warnings</li>
              <li><strong>Info:</strong> General information and user actions</li>
              <li><strong>Debug:</strong> Detailed debugging information</li>
            </ul>
          </div>
          <div className="info-item">
            <h4>🔍 Filtering</h4>
            <ul>
              <li>Filter by log level to focus on specific issues</li>
              <li>Search across messages, users, and actions</li>
              <li>Combine filters for precise results</li>
            </ul>
          </div>
          <div className="info-item">
            <h4>📅 Retention</h4>
            <ul>
              <li>Logs are retained for 30 days</li>
              <li>Critical errors are kept longer</li>
              <li>Export important logs before clearing</li>
            </ul>
          </div>
          <div className="info-item">
            <h4>⚙️ Management</h4>
            <ul>
              <li>Clear logs to free up storage space</li>
              <li>Export logs for external analysis</li>
              <li>Monitor system health through logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;
