import { useState } from 'react';

// Mock API functions - replace with actual API calls
export const useAuthAPI = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers = [
        { id: 1, name: 'John Manager', email: 'manager@cowco.com', role: 'Farm Manager' },
        { id: 2, name: 'Dr. Sarah Vet', email: 'vet@cowco.com', role: 'Veterinarian' },
        { id: 3, name: 'Mike Worker', email: 'worker@cowco.com', role: 'Worker' },
        { id: 4, name: 'Admin User', email: 'admin@cowco.com', role: 'Admin' }
      ];

      const user = mockUsers.find(u => u.email === email);
      
      if (user && password === 'password123') {
        return { success: true, user: { ...user, token: 'mock-jwt-token' } };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        token: 'mock-jwt-token'
      };
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    signup,
    forgotPassword,
    loading
  };
};
