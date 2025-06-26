import { useState, useEffect } from 'react';
import { apiRequest, getAuthHeaders } from './config';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsResponse, analyticsResponse] = await Promise.all([
        apiRequest('/reports', { headers: getAuthHeaders() }),
        apiRequest('/analytics', { headers: getAuthHeaders() })
      ]);
      
      setReports(reportsResponse);
      setAnalytics(analyticsResponse);
    } catch (err) {
      setError('Failed to fetch reports data');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportData) => {
    try {
      const response = await apiRequest('/reports', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reportData),
      });
      
      // Refresh the data
      await fetchData();
      return { success: true, report_id: response.report_id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteReport = async (id) => {
    try {
      await apiRequest(`/reports/${id}`, {
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

  const getReportsByType = (type) => {
    return reports.filter(report => report.type === type);
  };

  const getReportsByDateRange = (startDate, endDate) => {
    return reports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
    });
  };

  const getAnalyticsData = () => {
    return analytics;
  };

  const exportReport = async (reportId, format = 'pdf') => {
    try {
      const response = await apiRequest(`/reports/${reportId}/export`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ format }),
      });
      
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    reports,
    analytics,
    loading,
    error,
    generateReport,
    deleteReport,
    getReportsByType,
    getReportsByDateRange,
    getAnalyticsData,
    exportReport,
    refreshData: fetchData
  };
};
