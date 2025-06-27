import { useState, useEffect } from 'react';
import { apiRequest, getAuthHeaders } from './config';

export const useAdmin = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, logsResponse, settingsResponse] = await Promise.all([
        apiRequest('/admin/users', { headers: getAuthHeaders() }),
        apiRequest('/admin/logs', { headers: getAuthHeaders() }),
        apiRequest('/admin/settings', { headers: getAuthHeaders() })
      ]);
      
      setUsers(usersResponse);
      setLogs(logsResponse);
      setSettings(settingsResponse);
    } catch (err) {
      setError('Failed to fetch admin data');
      console.error('Error fetching admin data:', err);
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

  const getLogsByDateRange = (startDate, endDate) => {
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= new Date(startDate) && logDate <= new Date(endDate);
    });
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

  const exportLogs = async (format = 'csv') => {
    try {
      const response = await apiRequest(`/admin/logs/export?format=${format}`, {
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
    updateSettings,
    exportLogs,
    refreshData: fetchData
  };
};
