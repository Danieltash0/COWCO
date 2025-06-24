import { useState, useEffect } from 'react';

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: 'John Manager',
    email: 'manager@cowco.com',
    role: 'Farm Manager',
    status: 'active',
    lastLogin: '2024-01-15T08:30:00',
    createdAt: '2023-01-15',
    permissions: ['cattle', 'tasks', 'reports', 'analytics']
  },
  {
    id: 2,
    name: 'Dr. Sarah Vet',
    email: 'vet@cowco.com',
    role: 'Veterinarian',
    status: 'active',
    lastLogin: '2024-01-15T09:15:00',
    createdAt: '2023-02-20',
    permissions: ['cattle', 'health-records', 'health-alerts']
  },
  {
    id: 3,
    name: 'Mike Worker',
    email: 'worker@cowco.com',
    role: 'Worker',
    status: 'active',
    lastLogin: '2024-01-15T07:45:00',
    createdAt: '2023-03-10',
    permissions: ['cattle', 'tasks', 'checklist']
  },
  {
    id: 4,
    name: 'Admin User',
    email: 'admin@cowco.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-15T10:00:00',
    createdAt: '2023-01-01',
    permissions: ['all']
  }
];

// Mock activity logs data
const mockLogs = [
  {
    id: 1,
    userId: 1,
    userName: 'John Manager',
    action: 'login',
    description: 'User logged in successfully',
    timestamp: '2024-01-15T08:30:00',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 2,
    userId: 1,
    userName: 'John Manager',
    action: 'cattle_add',
    description: 'Added new cattle: Rosie (COW004)',
    timestamp: '2024-01-15T08:35:00',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 3,
    userId: 2,
    userName: 'Dr. Sarah Vet',
    action: 'health_record_add',
    description: 'Added health record for Bessie (COW001)',
    timestamp: '2024-01-15T09:20:00',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    id: 4,
    userId: 3,
    userName: 'Mike Worker',
    action: 'task_complete',
    description: 'Completed task: Morning Milking',
    timestamp: '2024-01-15T08:45:00',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    id: 5,
    userId: 4,
    userName: 'Admin User',
    action: 'user_create',
    description: 'Created new user: Test User',
    timestamp: '2024-01-15T10:15:00',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
];

// Mock settings data
const mockSettings = {
  notifications: {
    email: true,
    sms: false,
    push: true
  },
  reminders: {
    vaccination: 7,
    healthCheck: 30,
    milking: 1
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30
  },
  security: {
    sessionTimeout: 30,
    requireMFA: false,
    passwordExpiry: 90
  }
};

export const useAdmin = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
        setLogs(mockLogs);
        setSettings(mockSettings);
      } catch (err) {
        setError('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // User management functions
  const addUser = async (userData) => {
    try {
      const newUser = {
        id: Date.now(),
        ...userData,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: null,
        permissions: getPermissionsByRole(userData.role)
      };
      
      setUsers(prev => [...prev, newUser]);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (id, userData) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...userData } : user
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async (id) => {
    try {
      setUsers(prev => prev.filter(user => user.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Log management functions
  const getLogsByUser = (userId) => {
    return logs.filter(log => log.userId === userId);
  };

  const getLogsByAction = (action) => {
    return logs.filter(log => log.action === action);
  };

  const getLogsByDateRange = (startDate, endDate) => {
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= new Date(startDate) && logDate <= new Date(endDate);
    });
  };

  // Settings management functions
  const updateSettings = async (newSettings) => {
    try {
      setSettings(prev => ({ ...prev, ...newSettings }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getPermissionsByRole = (role) => {
    switch (role) {
      case 'Farm Manager':
        return ['cattle', 'tasks', 'reports', 'analytics'];
      case 'Veterinarian':
        return ['cattle', 'health-records', 'health-alerts'];
      case 'Worker':
        return ['cattle', 'tasks', 'checklist'];
      case 'Admin':
        return ['all'];
      default:
        return [];
    }
  };

  const exportLogs = async (format = 'csv') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, message: `Logs exported as ${format.toUpperCase()}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    users,
    logs,
    settings,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getLogsByUser,
    getLogsByAction,
    getLogsByDateRange,
    updateSettings,
    exportLogs
  };
};
