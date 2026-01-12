const User = require('../models/User');
const { hashPassword } = require('../utils/bcrypt');

// Role mapping from frontend to database
const roleMapping = {
  'Farm Manager': 'manager',
  'Veterinarian': 'vet',
  'Worker': 'worker',
  'Admin': 'admin'
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Map frontend role to database role
    const dbRole = roleMapping[role] || 'worker'; // Default to worker if role not found
    
    // Hash the password before storing
    const password_hash = await hashPassword(password);
    const userId = await User.createUser({ name, email, password_hash, role: dbRole });
    res.status(201).json({ userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 