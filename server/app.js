const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Handle both JSON and text/plain content types
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

// Custom middleware to parse text/plain as JSON
app.use((req, res, next) => {
  if (req.get('Content-Type') === 'text/plain;charset=UTF-8' && req.body) {
    try {
      req.body = JSON.parse(req.body);
    } catch (error) {
      console.log('Failed to parse text/plain as JSON:', error.message);
    }
  }
  next();
});

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
      qr: '/api/qr',
      admin: '/api/admin'
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
app.use('/api/milking', require('./routes/milkingRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

module.exports = app;
