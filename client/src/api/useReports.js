import { useState, useEffect } from 'react';
import { apiRequest, getAuthHeaders } from './config';

export const useReports = () => {
  const [productionSummary, setProductionSummary] = useState(null);
  const [healthSummary, setHealthSummary] = useState(null);
  const [financialSummary, setFinancialSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [production, health, financial] = await Promise.all([
        apiRequest('/reports/production-summary', { headers: getAuthHeaders() }),
        apiRequest('/reports/health-summary', { headers: getAuthHeaders() }),
        apiRequest('/reports/financial-summary', { headers: getAuthHeaders() })
      ]);

      setProductionSummary(production);
      setHealthSummary(health);
      setFinancialSummary(financial);
    } catch (err) {
      setError('Failed to fetch reports data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    productionSummary,
    healthSummary,
    financialSummary,
    loading,
    error,
    refreshData: fetchData
  };
}; 