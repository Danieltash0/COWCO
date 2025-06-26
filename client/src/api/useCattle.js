import { useState, useEffect } from 'react';
import { apiRequest, getAuthHeaders } from './config';

export const useCattle = () => {
  const [cattle, setCattle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCattle();
  }, []);

  const fetchCattle = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/cattle', {
        headers: getAuthHeaders(),
      });
      setCattle(response);
    } catch (err) {
      setError('Failed to fetch cattle data');
      console.error('Error fetching cattle:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCattle = async (cattleData) => {
    try {
      const response = await apiRequest('/cattle', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(cattleData),
      });
      
      // Refresh the cattle list
      await fetchCattle();
      return { success: true, cattle_id: response.cattle_id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateCattle = async (id, cattleData) => {
    try {
      await apiRequest(`/cattle/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(cattleData),
      });
      
      // Refresh the cattle list
      await fetchCattle();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteCattle = async (id) => {
    try {
      await apiRequest(`/cattle/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      // Refresh the cattle list
      await fetchCattle();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getCattleById = async (id) => {
    try {
      const response = await apiRequest(`/cattle/${id}`, {
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error('Error fetching cattle by ID:', error);
      return null;
    }
  };

  return {
    cattle,
    loading,
    error,
    addCattle,
    updateCattle,
    deleteCattle,
    getCattleById,
    refreshCattle: fetchCattle
  };
};
