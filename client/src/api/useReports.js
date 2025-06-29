import { useState, useEffect } from 'react';
import { apiRequest } from './config';

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
        apiRequest('/reports/production-summary'),
        apiRequest('/reports/health-summary'),
        apiRequest('/reports/financial-summary')
      ]);

      setProductionSummary(production);
      setHealthSummary(health);
      setFinancialSummary(financial);
    } catch (err) {
      console.error('Error fetching reports:', err);
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