import { useState, useEffect } from 'react';

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
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setHealthRecords(mockHealthRecords);
        setHealthAlerts(mockHealthAlerts);
      } catch (err) {
        setError('Failed to fetch veterinary data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addHealthRecord = async (recordData) => {
    try {
      const newRecord = {
        id: Date.now(),
        ...recordData,
        date: recordData.date || new Date().toISOString().split('T')[0],
        status: 'completed'
      };
      
      setHealthRecords(prev => [...prev, newRecord]);
      return { success: true, record: newRecord };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateHealthRecord = async (id, recordData) => {
    try {
      setHealthRecords(prev => prev.map(record => 
        record.id === id ? { ...record, ...recordData } : record
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteHealthRecord = async (id) => {
    try {
      setHealthRecords(prev => prev.filter(record => record.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addHealthAlert = async (alertData) => {
    try {
      const newAlert = {
        id: Date.now(),
        ...alertData,
        status: 'pending'
      };
      
      setHealthAlerts(prev => [...prev, newAlert]);
      return { success: true, alert: newAlert };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateHealthAlert = async (id, alertData) => {
    try {
      setHealthAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, ...alertData } : alert
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteHealthAlert = async (id) => {
    try {
      setHealthAlerts(prev => prev.filter(alert => alert.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getHealthRecordsByCattle = (cattleId) => {
    return healthRecords.filter(record => record.cattleId === cattleId);
  };

  const getHealthRecordsByType = (type) => {
    return healthRecords.filter(record => record.type === type);
  };

  const getUpcomingAlerts = () => {
    const today = new Date();
    return healthAlerts.filter(alert => {
      const dueDate = new Date(alert.dueDate);
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
    getUpcomingAlerts
  };
};
