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

  const getLogLevelColor = (action) => {
    // Determine level based on action type
    if (action?.includes('error') || action?.includes('fail')) return 'red';
    if (action?.includes('warn') || action?.includes('warning')) return 'orange';
    if (action?.includes('login') || action?.includes('logout')) return 'blue';
    return 'gray';
  };

  const getLogLevelIcon = (action) => {
    // Determine icon based on action type
    if (action?.includes('error') || action?.includes('fail')) return '❌';
    if (action?.includes('warn') || action?.includes('warning')) return '⚠️';
    if (action?.includes('login') || action?.includes('logout')) return 'ℹ️';
    if (action?.includes('add') || action?.includes('create')) return '➕';
    if (action?.includes('update') || action?.includes('edit')) return '✏️';
    if (action?.includes('delete') || action?.includes('remove')) return '🗑️';
    if (action?.includes('complete') || action?.includes('finish')) return '✅';
    return '📝';
  };

  const getLogLevel = (action) => {
    // Determine level based on action type
    if (action?.includes('error') || action?.includes('fail')) return 'ERROR';
    if (action?.includes('warn') || action?.includes('warning')) return 'WARN';
    if (action?.includes('login') || action?.includes('logout')) return 'INFO';
    return 'INFO';
  };

  const filteredLogs = logs.filter(log => {
    const logLevel = getLogLevel(log.action);
    const matchesFilter = filter === 'all' || logLevel.toLowerCase() === filter;
    const matchesSearch = searchTerm === '' || 
      (log.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (log.action?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
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
            {logs.filter(log => getLogLevel(log.action) === 'ERROR').length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Warnings</h3>
          <div className="summary-count orange">
            {logs.filter(log => getLogLevel(log.action) === 'WARN').length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Info</h3>
          <div className="summary-count blue">
            {logs.filter(log => getLogLevel(log.action) === 'INFO').length}
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
                <tr key={log.id} className={`log-row ${getLogLevel(log.action).toLowerCase()}`}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>
                    <span className={`log-level ${getLogLevelColor(log.action)}`}>
                      {getLogLevelIcon(log.action)} {getLogLevel(log.action)}
                    </span>
                  </td>
                  <td>{log.userName || 'Unknown'}</td>
                  <td>{log.action || 'Unknown'}</td>
                  <td className="log-message">{log.description || 'No description'}</td>
                  <td>{log.ipAddress || 'N/A'}</td>
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
