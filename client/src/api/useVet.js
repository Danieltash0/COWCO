import { useState, useEffect } from 'react';
import { apiRequest, getAuthHeaders } from './config';

// Mock health records data
const mockHealthRecords = [
  {
    id: 1,
    cattleId: 'COW001',
    cattleName: 'Bessie',
    type: 'vaccination',
    description: 'Annual vaccination - BVD, IBR, Leptospirosis',
    date: '2024-01-10',
    veterinarian: 'Dr. Sarah Vet',
    status: 'completed',
    notes: 'All vaccinations administered successfully. No adverse reactions observed.',
    nextDueDate: '2025-01-10'
  },
  {
    id: 2,
    cattleId: 'COW002',
    cattleName: 'Daisy',
    type: 'checkup',
    description: 'Routine health check',
    date: '2024-01-12',
    veterinarian: 'Dr. Sarah Vet',
    status: 'completed',
    notes: 'Overall health is good. Weight is stable. Recommend monitoring feed intake.',
    nextDueDate: '2024-04-12'
  },
  {
    id: 3,
    cattleId: 'COW003',
    cattleName: 'Molly',
    type: 'treatment',
    description: 'Treatment for minor injury - right hind leg',
    date: '2024-01-08',
    veterinarian: 'Dr. Sarah Vet',
    status: 'in-progress',
    notes: 'Minor swelling observed. Administered anti-inflammatory medication. Monitor for improvement.',
    nextDueDate: '2024-01-15'
  },
  {
    id: 4,
    cattleId: 'COW004',
    cattleName: 'Rosie',
    type: 'vaccination',
    description: 'Young cattle vaccination series',
    date: '2024-01-14',
    veterinarian: 'Dr. Sarah Vet',
    status: 'completed',
    notes: 'First vaccination in series completed. Schedule follow-up in 3 weeks.',
    nextDueDate: '2024-02-04'
  }
];

// Mock health alerts data
const mockHealthAlerts = [
  {
    id: 1,
    cattleId: 'COW003',
    cattleName: 'Molly',
    type: 'follow-up',
    description: 'Follow-up examination for leg injury',
    dueDate: '2024-01-15',
    priority: 'high',
    status: 'pending'
  },
  {
    id: 2,
    cattleId: 'COW004',
    cattleName: 'Rosie',
    type: 'vaccination',
    description: 'Second vaccination in series',
    dueDate: '2024-02-04',
    priority: 'medium',
    status: 'pending'
  },
  {
    id: 3,
    cattleId: 'COW002',
    cattleName: 'Daisy',
    type: 'checkup',
    description: 'Quarterly health check',
    dueDate: '2024-04-12',
    priority: 'low',
    status: 'pending'
  }
];

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
        apiRequest('/health-records', { headers: getAuthHeaders() }),
        apiRequest('/health-alerts', { headers: getAuthHeaders() })
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

  const addHealthRecord = async (recordData) => {
    try {
      const response = await apiRequest('/health-records', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(recordData),
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
      await apiRequest(`/health-records/${id}`, {
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
      await apiRequest(`/health-records/${id}`, {
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
      const response = await apiRequest('/health-alerts', {
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
      await apiRequest(`/health-alerts/${id}`, {
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
      await apiRequest(`/health-alerts/${id}`, {
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
