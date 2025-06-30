import { useState, useEffect } from 'react';
import { apiRequest, getAuthHeaders } from './config';

export const useVet = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const recordsResponse = await apiRequest('/vet/health-records', { headers: getAuthHeaders() });
      setHealthRecords(recordsResponse);
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

  const getHealthRecordsByCattle = (cattleId) => {
    return healthRecords.filter(record => record.cattle_id === cattleId);
  };

  const getHealthRecordsByType = (type) => {
    return healthRecords.filter(record => record.type === type);
  };

  return {
    healthRecords,
    loading,
    error,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    getHealthRecordsByCattle,
    getHealthRecordsByType,
    refreshData: fetchData
  };
};
