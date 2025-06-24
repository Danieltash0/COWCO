import { useState, useEffect } from 'react';

// Mock reports data
const mockReports = [
  {
    id: 1,
    title: 'Monthly Milk Production Report',
    type: 'production',
    date: '2024-01-15',
    generatedBy: 'John Manager',
    status: 'completed',
    data: {
      totalMilk: 12500,
      averagePerCow: 3125,
      topProducer: 'Bessie',
      totalCattle: 4
    }
  },
  {
    id: 2,
    title: 'Health Records Summary',
    type: 'health',
    date: '2024-01-14',
    generatedBy: 'Dr. Sarah Vet',
    status: 'completed',
    data: {
      totalCheckups: 4,
      vaccinations: 2,
      treatments: 1,
      healthyCattle: 3
    }
  },
  {
    id: 3,
    title: 'Financial Report - Q4 2023',
    type: 'financial',
    date: '2024-01-10',
    generatedBy: 'John Manager',
    status: 'completed',
    data: {
      revenue: 45000,
      expenses: 28000,
      profit: 17000,
      profitMargin: 37.8
    }
  }
];

// Mock analytics data
const mockAnalytics = {
  milkProduction: {
    daily: [25, 28, 30, 27, 29, 31, 26],
    weekly: [180, 195, 210, 185],
    monthly: [1250, 1320, 1400, 1280]
  },
  financial: {
    revenue: [42000, 45000, 48000, 52000],
    expenses: [28000, 29000, 31000, 32000],
    profit: [14000, 16000, 17000, 20000]
  },
  health: {
    vaccinations: 8,
    checkups: 12,
    treatments: 3,
    healthyRate: 85
  },
  tasks: {
    completed: 45,
    pending: 8,
    overdue: 2,
    completionRate: 82
  }
};

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReports(mockReports);
        setAnalytics(mockAnalytics);
      } catch (err) {
        setError('Failed to fetch reports data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateReport = async (reportData) => {
    try {
      const newReport = {
        id: Date.now(),
        ...reportData,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        data: generateMockData(reportData.type)
      };
      
      setReports(prev => [...prev, newReport]);
      return { success: true, report: newReport };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const generateMockData = (type) => {
    switch (type) {
      case 'production':
        return {
          totalMilk: Math.floor(Math.random() * 15000) + 10000,
          averagePerCow: Math.floor(Math.random() * 4000) + 2500,
          topProducer: 'Bessie',
          totalCattle: 4
        };
      case 'health':
        return {
          totalCheckups: Math.floor(Math.random() * 10) + 1,
          vaccinations: Math.floor(Math.random() * 5) + 1,
          treatments: Math.floor(Math.random() * 3),
          healthyCattle: Math.floor(Math.random() * 4) + 1
        };
      case 'financial':
        return {
          revenue: Math.floor(Math.random() * 60000) + 40000,
          expenses: Math.floor(Math.random() * 40000) + 20000,
          profit: Math.floor(Math.random() * 30000) + 10000,
          profitMargin: Math.floor(Math.random() * 50) + 20
        };
      default:
        return {};
    }
  };

  const deleteReport = async (id) => {
    try {
      setReports(prev => prev.filter(report => report.id !== id));
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
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, message: `Report exported as ${format.toUpperCase()}` };
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
    exportReport
  };
};
