const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cattle', require('./routes/cattleRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/vet', require('./routes/vetRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

module.exports = app;
