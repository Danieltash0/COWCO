import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('cowco_user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.token) {
        const userData = { ...response.user, token: response.token };
        setUser(userData);
        localStorage.setItem('cowco_user', JSON.stringify(userData));
        localStorage.setItem('token', response.token);
        return { success: true, user: userData };
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await apiRequest('/users/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (response.userId) {
        // After successful signup, automatically log in the user
        const loginResult = await login(userData.email, userData.password);
        if (loginResult.success) {
          return { success: true, user: loginResult.user };
        } else {
          return { success: true, message: 'Account created successfully. Please log in.' };
        }
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cowco_user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
