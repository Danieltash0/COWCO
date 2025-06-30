import { useState, useEffect } from 'react';
import { apiRequest, getAuthHeaders } from './config';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest('/vet/appointments', { headers: getAuthHeaders() });
      setAppointments(data);
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async (appointment) => {
    try {
      await apiRequest('/vet/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(appointment),
      });
      await fetchAppointments();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    addAppointment,
    refresh: fetchAppointments
  };
}; 