import { useState, useEffect } from 'react';
import { apiRequest, getAuthHeaders } from './config';

export const useAdmin = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);
  const [logStats, setLogStats] = useState({});
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching admin data...');
      
      const [usersResponse, logsResponse, loginLogsResponse, logStatsResponse, settingsResponse] = await Promise.all([
        apiRequest('/admin/users', { headers: getAuthHeaders() }),
        apiRequest('/admin/logs', { headers: getAuthHeaders() }),
        apiRequest('/admin/logs/login', { headers: getAuthHeaders() }),
        apiRequest('/admin/logs/stats', { headers: getAuthHeaders() }),
        apiRequest('/admin/settings', { headers: getAuthHeaders() })
      ]);
      
      console.log('Admin data fetched successfully:', {
        users: usersResponse.length,
        logs: logsResponse.length,
        loginLogs: loginLogsResponse.length,
        logStats: logStatsResponse,
        settings: settingsResponse
      });
      
      setUsers(usersResponse);
      setLogs(logsResponse);
      setLoginLogs(loginLogsResponse);
      setLogStats(logStatsResponse);
      setSettings(settingsResponse);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(`Failed to fetch admin data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // User management functions
  const addUser = async (userData) => {
    try {
      const response = await apiRequest('/admin/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      
      if (response.success) {
        // Refresh the users list
        await fetchData();
      }
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const response = await apiRequest(`/admin/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      
      if (response.success) {
        // Refresh the users list
        await fetchData();
      }
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await apiRequest(`/admin/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (response.success) {
        // Refresh the users list
        await fetchData();
      }
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      const response = await apiRequest(`/admin/users/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      
      if (response.success) {
        // Refresh the users list
        await fetchData();
      }
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Log management functions
  const getLogsByUser = async (userId) => {
    try {
      const response = await apiRequest(`/admin/logs/user/${userId}`, {
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error('Error fetching user logs:', error);
      return [];
    }
  };

  const getLogsByAction = async (action) => {
    try {
      const response = await apiRequest(`/admin/logs/action/${action}`, {
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error('Error fetching action logs:', error);
      return [];
    }
  };

  const getLogsByDateRange = async (startDate, endDate) => {
    try {
      const response = await apiRequest(`/admin/logs?startDate=${startDate}&endDate=${endDate}`, {
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error('Error fetching date range logs:', error);
      return [];
    }
  };

  const clearOldLogs = async (daysOld = 30) => {
    try {
      const response = await apiRequest(`/admin/logs/clear?daysOld=${daysOld}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (response.success) {
        // Refresh the logs
        await fetchData();
      }
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Settings management functions
  const updateSettings = async (newSettings) => {
    try {
      const response = await apiRequest('/admin/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSettings),
      });
      
      if (response.success) {
        // Refresh the settings
        const settingsResponse = await apiRequest('/admin/settings', {
          headers: getAuthHeaders(),
        });
        setSettings(settingsResponse);
      }
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getPermissionsByRole = (role) => {
    switch (role) {
      case 'Farm Manager':
        return ['cattle', 'tasks', 'reports', 'analytics'];
      case 'Veterinarian':
        return ['cattle', 'health-records', 'health-alerts'];
      case 'Worker':
        return ['cattle', 'tasks', 'checklist'];
      case 'Admin':
        return ['all'];
      default:
        return [];
    }
  };

  const exportLogs = async (format = 'csv', startDate, endDate) => {
    try {
      let url = `/admin/logs/export?format=${format}`;
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      
      const response = await apiRequest(url, {
        headers: getAuthHeaders(),
      });
      
      if (format === 'csv') {
        // Create and download the file
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
      return { success: true, message: `Logs exported as ${format.toUpperCase()}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    users,
    logs,
    loginLogs,
    logStats,
    settings,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getLogsByUser,
    getLogsByAction,
    getLogsByDateRange,
    clearOldLogs,
    updateSettings,
    exportLogs,
    refreshData: fetchData
  };
};
