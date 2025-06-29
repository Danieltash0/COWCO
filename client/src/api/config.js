// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Common API utilities
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token
  const token = localStorage.getItem('token');
  
  // Ensure Content-Type is application/json for requests with body
  const hasBody = options.body || options.method === 'POST' || options.method === 'PUT';
  
  const defaultOptions = {
    headers: {
      ...(hasBody && { 'Content-Type': 'application/json' }),
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default API_BASE_URL; 