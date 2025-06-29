import { useState, useEffect } from 'react';
import { apiRequest, getAuthHeaders } from './config';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/tasks', {
        headers: getAuthHeaders(),
      });
      setTasks(response);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await apiRequest('/tasks', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });
      
      // Refresh the tasks list
      await fetchTasks();
      return { success: true, task_id: response.task_id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      await apiRequest(`/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });
      
      // Refresh the tasks list
      await fetchTasks();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiRequest(`/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      // Refresh the tasks list
      await fetchTasks();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const completeTask = async (id) => {
    try {
      await apiRequest(`/tasks/${id}/complete`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      
      // Refresh the tasks list
      await fetchTasks();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getTasksByUser = (userName) => {
    return tasks.filter(task => task.assigned_to === userName);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.is_completed === (status === 'completed'));
  };

  const getTasksByCategory = (category) => {
    return tasks.filter(task => task.category === category);
  };

  const fetchWorkers = async () => {
    try {
      const response = await apiRequest('/admin/users', {
        headers: getAuthHeaders(),
      });
      // Filter only workers (backend sends 'Worker' not 'worker')
      const workers = response.filter(user => user.role === 'Worker' && user.status === 'active');
      return workers;
    } catch (error) {
      console.error('Error fetching workers:', error);
      return [];
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    getTasksByUser,
    getTasksByStatus,
    getTasksByCategory,
    fetchWorkers,
    refreshTasks: fetchTasks
  };
};
