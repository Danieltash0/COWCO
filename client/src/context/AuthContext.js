import React, { createContext, useContext, useState, useEffect } from 'react';

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
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock API call - replace with actual API
      const mockUsers = [
        { id: 1, name: 'John Manager', email: 'manager@cowco.com', role: 'Farm Manager' },
        { id: 2, name: 'Dr. Sarah Vet', email: 'vet@cowco.com', role: 'Veterinarian' },
        { id: 3, name: 'Mike Worker', email: 'worker@cowco.com', role: 'Worker' },
        { id: 4, name: 'Admin User', email: 'admin@cowco.com', role: 'Admin' }
      ];

      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password123') {
        const userData = { ...foundUser, token: 'mock-jwt-token' };
        setUser(userData);
        localStorage.setItem('cowco_user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      // Mock API call - replace with actual API
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        token: 'mock-jwt-token'
      };
      
      setUser(newUser);
      localStorage.setItem('cowco_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cowco_user');
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
