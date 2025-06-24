import { useState, useEffect } from 'react';

// Mock cattle data
const mockCattle = [
  {
    id: 'COW001',
    name: 'Bessie',
    breed: 'Holstein',
    age: 4,
    weight: 650,
    health: 'Excellent',
    location: 'Barn A - Stall 1',
    gender: 'Female',
    dateOfBirth: '2020-03-15',
    lastMilking: '2024-01-15T08:30:00',
    lastVaccination: '2024-01-10',
    owner: 'John Manager',
    notes: 'High milk producer, gentle temperament'
  },
  {
    id: 'COW002',
    name: 'Daisy',
    breed: 'Jersey',
    age: 3,
    weight: 450,
    health: 'Good',
    location: 'Barn A - Stall 2',
    gender: 'Female',
    dateOfBirth: '2021-06-20',
    lastMilking: '2024-01-15T09:15:00',
    lastVaccination: '2024-01-12',
    owner: 'John Manager',
    notes: 'Good butterfat content'
  },
  {
    id: 'COW003',
    name: 'Molly',
    breed: 'Angus',
    age: 5,
    weight: 750,
    health: 'Fair',
    location: 'Barn B - Stall 1',
    gender: 'Female',
    dateOfBirth: '2019-09-10',
    lastMilking: '2024-01-15T07:45:00',
    lastVaccination: '2024-01-08',
    owner: 'John Manager',
    notes: 'Recovering from minor injury'
  },
  {
    id: 'COW004',
    name: 'Rosie',
    breed: 'Holstein',
    age: 2,
    weight: 550,
    health: 'Excellent',
    location: 'Barn A - Stall 3',
    gender: 'Female',
    dateOfBirth: '2022-01-25',
    lastMilking: '2024-01-15T10:00:00',
    lastVaccination: '2024-01-14',
    owner: 'John Manager',
    notes: 'Young and energetic'
  }
];

export const useCattle = () => {
  const [cattle, setCattle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchCattle = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCattle(mockCattle);
      } catch (err) {
        setError('Failed to fetch cattle data');
      } finally {
        setLoading(false);
      }
    };

    fetchCattle();
  }, []);

  const addCattle = async (cattleData) => {
    try {
      const newCattle = {
        id: `COW${String(cattle.length + 1).padStart(3, '0')}`,
        ...cattleData,
        dateOfBirth: cattleData.dateOfBirth || new Date().toISOString().split('T')[0],
        lastMilking: new Date().toISOString(),
        lastVaccination: new Date().toISOString().split('T')[0]
      };
      
      setCattle(prev => [...prev, newCattle]);
      return { success: true, cattle: newCattle };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateCattle = async (id, cattleData) => {
    try {
      setCattle(prev => prev.map(cow => 
        cow.id === id ? { ...cow, ...cattleData } : cow
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteCattle = async (id) => {
    try {
      setCattle(prev => prev.filter(cow => cow.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getCattleById = (id) => {
    return cattle.find(cow => cow.id === id);
  };

  return {
    cattle,
    loading,
    error,
    addCattle,
    updateCattle,
    deleteCattle,
    getCattleById
  };
};
