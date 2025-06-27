import { useState, useEffect } from 'react';
import { apiRequest, getAuthHeaders } from './config';

export const useAnalytics = () => {
  const [financialRecords, setFinancialRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinancialRecords();
  }, []);

  const fetchFinancialRecords = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/analytics/financial-records', {
        headers: getAuthHeaders(),
      });
      setFinancialRecords(response);
    } catch (err) {
      setError('Failed to fetch financial records');
      console.error('Error fetching financial records:', err);
    } finally {
      setLoading(false);
    }
  };

  const addFinancialRecord = async (recordData) => {
    try {
      const response = await apiRequest('/analytics/financial-records', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(recordData),
      });
      
      // Refresh the records list
      await fetchFinancialRecords();
      return { success: true, record: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateFinancialRecord = async (id, recordData) => {
    try {
      await apiRequest(`/analytics/financial-records/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(recordData),
      });
      
      // Refresh the records list
      await fetchFinancialRecords();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteFinancialRecord = async (id) => {
    try {
      await apiRequest(`/analytics/financial-records/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      // Refresh the records list
      await fetchFinancialRecords();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getAnalytics = async (dateRange = 'month') => {
    try {
      const response = await apiRequest(`/analytics/summary?range=${dateRange}`, {
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  };

  const exportFinancialReport = async (dateRange = 'month') => {
    try {
      const response = await apiRequest(`/analytics/export?range=${dateRange}`, {
        headers: getAuthHeaders(),
      });
      
      // Create and download the file
      const blob = new Blob([response.data], { type: response.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true, message: 'Report exported successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    financialRecords,
    loading,
    error,
    addFinancialRecord,
    updateFinancialRecord,
    deleteFinancialRecord,
    getAnalytics,
    exportFinancialReport,
    refreshFinancialRecords: fetchFinancialRecords
  };
}; 