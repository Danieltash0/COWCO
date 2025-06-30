import { useState, useEffect } from 'react';
import { apiRequest, getAuthHeaders } from './config';

export const useVet = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [healthAlerts, setHealthAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsResponse, alertsResponse] = await Promise.all([
        apiRequest('/vet/health-records', { headers: getAuthHeaders() }),
        apiRequest('/vet/health-alerts', { headers: getAuthHeaders() })
      ]);
      
      setHealthRecords(recordsResponse);
      setHealthAlerts(alertsResponse);
    } catch (err) {
      setError('Failed to fetch veterinary data');
      console.error('Error fetching vet data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Utility to convert undefined values to null
  const sanitizeRecordData = (data) =>
    Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === undefined ? null : v])
    );

  const addHealthRecord = async (recordData) => {
    try {
      const sanitized = sanitizeRecordData(recordData);
      console.log('Submitting health record:', sanitized);
      const response = await apiRequest('/vet/health-records', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(sanitized),
      });
      
      // Refresh the data
      await fetchData();
      return { success: true, record_id: response.record_id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateHealthRecord = async (id, recordData) => {
    try {
      await apiRequest(`/vet/health-records/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(recordData),
      });
      
      // Refresh the data
      await fetchData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteHealthRecord = async (id) => {
    try {
      await apiRequest(`/vet/health-records/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      // Refresh the data
      await fetchData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addHealthAlert = async (alertData) => {
    try {
      const response = await apiRequest('/vet/health-alerts', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(alertData),
      });
      
      // Refresh the data
      await fetchData();
      return { success: true, alert_id: response.alert_id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateHealthAlert = async (id, alertData) => {
    try {
      await apiRequest(`/vet/health-alerts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(alertData),
      });
      
      // Refresh the data
      await fetchData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteHealthAlert = async (id) => {
    try {
      await apiRequest(`/vet/health-alerts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      // Refresh the data
      await fetchData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getHealthRecordsByCattle = (cattleId) => {
    return healthRecords.filter(record => record.cattle_id === cattleId);
  };

  const getHealthRecordsByType = (type) => {
    return healthRecords.filter(record => record.type === type);
  };

  const getUpcomingAlerts = () => {
    const today = new Date();
    return healthAlerts.filter(alert => {
      const dueDate = new Date(alert.due_date);
      return dueDate >= today && alert.status === 'pending';
    });
  };

  return {
    healthRecords,
    healthAlerts,
    loading,
    error,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    addHealthAlert,
    updateHealthAlert,
    deleteHealthAlert,
    getHealthRecordsByCattle,
    getHealthRecordsByType,
    getUpcomingAlerts,
    refreshData: fetchData
  };
};
