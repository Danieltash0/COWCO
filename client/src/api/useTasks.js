import { useState, useEffect } from 'react';

// Mock task data
const mockTasks = [
  {
    id: 1,
    title: 'Morning Milking',
    description: 'Complete morning milking for all cattle in Barn A',
    assignedTo: 'Mike Worker',
    assignedBy: 'John Manager',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-01-15',
    completedDate: '2024-01-15T08:30:00',
    category: 'milking'
  },
  {
    id: 2,
    title: 'Health Check - Bessie',
    description: 'Routine health check for Bessie (COW001)',
    assignedTo: 'Dr. Sarah Vet',
    assignedBy: 'John Manager',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2024-01-16',
    category: 'health'
  },
  {
    id: 3,
    title: 'Feed Distribution',
    description: 'Distribute feed to all cattle in both barns',
    assignedTo: 'Mike Worker',
    assignedBy: 'John Manager',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-01-15',
    category: 'feeding'
  },
  {
    id: 4,
    title: 'Barn Cleaning',
    description: 'Clean and sanitize Barn B stalls',
    assignedTo: 'Mike Worker',
    assignedBy: 'John Manager',
    status: 'pending',
    priority: 'medium',
    dueDate: '2024-01-16',
    category: 'maintenance'
  },
  {
    id: 5,
    title: 'Vaccination Schedule Review',
    description: 'Review and update vaccination schedules for all cattle',
    assignedTo: 'Dr. Sarah Vet',
    assignedBy: 'John Manager',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-01-17',
    category: 'health'
  }
];

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTasks(mockTasks);
      } catch (err) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (taskData) => {
    try {
      const newTask = {
        id: Date.now(),
        ...taskData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setTasks(prev => [...prev, newTask]);
      return { success: true, task: newTask };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...taskData } : task
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteTask = async (id) => {
    try {
      setTasks(prev => prev.filter(task => task.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const completeTask = async (id) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === id 
          ? { ...task, status: 'completed', completedDate: new Date().toISOString() }
          : task
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getTasksByUser = (userName) => {
    return tasks.filter(task => task.assignedTo === userName);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByCategory = (category) => {
    return tasks.filter(task => task.category === category);
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
    getTasksByCategory
  };
};
