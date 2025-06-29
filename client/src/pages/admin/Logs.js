import React, { useState } from 'react';
import { useAdmin } from '../../api/useAdmin';
import Loader from '../../components/Loader';
import '../../styles/Admin.module.css';

const Logs = () => {
  const { logs, loginLogs, logStats, loading, error, clearOldLogs, exportLogs } = useAdmin();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [showLoginLogs, setShowLoginLogs] = useState(false);

  const handleClearLogs = async () => {
    if (window.confirm('Are you sure you want to clear all logs older than 30 days? This action cannot be undone.')) {
      await clearOldLogs(30);
    }
  };

  const handleExportLogs = async (format) => {
    await exportLogs(format);
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
        <p>
          <strong>Total Logs:</strong> {logs.length} | 
          <strong>Login Events:</strong> {loginLogs.length} | 
          <strong>Errors:</strong> {logs.filter(log => getLogLevel(log.action) === 'ERROR').length} | 
          <strong>Active Users (7d):</strong> {logStats.unique_users || 0}
        </p>
        <p>
          <small>
            Logs are automatically cleared after 30 days. Use the "Clear Old Logs" button to manually clear logs older than 30 days.
          </small>
        </p>
      </div>
    </div>
  );
};

export default Logs;
