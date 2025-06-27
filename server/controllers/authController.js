const User = require('../models/User');
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
    
    // Check password (plain text comparison)
    if (password !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
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
    
    // In a real app, you would send an email here
    // For now, just return a success message
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
