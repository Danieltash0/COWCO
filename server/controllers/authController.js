const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Role mapping from database to frontend
const roleMapping = {
  'manager': 'Farm Manager',
  'vet': 'Veterinarian',
  'worker': 'Worker',
  'admin': 'Admin'
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user by email
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if user is active
    if (user.status === 'inactive') {
      return res.status(401).json({ error: 'Account is deactivated. Please contact administrator.' });
    }
    
    // Check password (plain text comparison)
    if (password !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login time
    await User.updateLastLogin(user.user_id);
    
    // Log the login activity
    await ActivityLog.createLog({
      user_id: user.user_id,
      action: 'login',
      description: `User ${user.name} logged in successfully`,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent')
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Remove password from response and map role to frontend format
    const { password_hash, ...userWithoutPassword } = user;
    const userForFrontend = {
      ...userWithoutPassword,
      role: roleMapping[user.role] || user.role
    };
    
    res.json({
      user: userForFrontend,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    // Log the logout activity
    if (req.user && req.user.userId) {
      await ActivityLog.createLog({
        user_id: req.user.userId,
        action: 'logout',
        description: `User logged out`,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent')
      });
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Log the password reset request
    await ActivityLog.createLog({
      user_id: user.user_id,
      action: 'password_reset_request',
      description: `Password reset requested for ${user.email}`,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent')
    });
    
    // In a real app, you would send an email here
    // For now, just return a success message
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: err.message });
  }
};
