const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CowCo Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for frontend connection
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Frontend successfully connected to backend!',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      cattle: '/api/cattle',
      tasks: '/api/tasks',
      vet: '/api/vet',
      reports: '/api/reports',
      qr: '/api/qr'
    }
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cattle', require('./routes/cattleRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/vet', require('./routes/vetRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/qr', require('./routes/qrRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

module.exports = app;
