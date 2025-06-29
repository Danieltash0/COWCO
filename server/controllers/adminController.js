const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// User Management
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    
    const formattedUsers = users.map(user => ({
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.last_login,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      permissions: getPermissionsByRole(user.role)
    }));
    
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create new user with plain text password (in production, use proper hashing)
    const userId = await User.createUser({
      name,
      email,
      password_hash: password || 'default123', // In production, require password
      role: role,
      status: 'active'
    });
    
    // Log the activity
    await ActivityLog.createLog({
      user_id: req.user.userId,
      action: 'user_create',
      description: `Created new user: ${name} (${email}) with role: ${role}`,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent')
    });
    
    res.status(201).json({ 
      success: true, 
      userId,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !role || !status) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, role, and status are required' 
      });
    }
    
    // Check if user exists
    const existingUser = await User.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prepare update data
    const updateData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role,
      status: status.toLowerCase()
    };
    
    // Add password if provided (plain text for now)
    if (password && password.trim()) {
      updateData.password_hash = password;
    }
    
    const success = await User.updateUser(id, updateData);
    
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Log the activity
    await ActivityLog.createLog({
      user_id: req.user.userId,
      action: 'user_update',
      description: `Updated user: ${name} (${email})`,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent')
    });
    
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user info for logging
    const user = await User.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    const success = await User.deleteUser(id);
    
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Log the activity
    await ActivityLog.createLog({
      user_id: req.user.userId,
      action: 'user_delete',
      description: `Deleted user: ${user.name} (${user.email})`,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent')
    });
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current user status
    const user = await User.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent admin from deactivating themselves
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }
    
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    const success = await User.updateUserStatus(id, newStatus);
    
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Log the activity
    await ActivityLog.createLog({
      user_id: req.user.userId,
      action: 'user_status_toggle',
      description: `Changed status of ${user.name} to ${newStatus}`,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent')
    });
    
    res.json({ success: true, status: newStatus, message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

// Activity Logs
const getActivityLogs = async (req, res) => {
  try {
    const { limit = 100, offset = 0, action, userId, startDate, endDate } = req.query;
    
    let logs;
    
    if (action) {
      logs = await ActivityLog.getLogsByAction(action, parseInt(limit));
    } else if (userId) {
      logs = await ActivityLog.getLogsByUser(userId, parseInt(limit));
    } else if (startDate && endDate) {
      logs = await ActivityLog.getLogsByDateRange(startDate, endDate, parseInt(limit));
    } else {
      logs = await ActivityLog.getLogs(parseInt(limit), parseInt(offset));
    }
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
};

const getLoginLogs = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const logs = await ActivityLog.getLoginLogs(parseInt(limit));
    res.json(logs);
  } catch (error) {
    console.error('Error fetching login logs:', error);
    res.status(500).json({ error: 'Failed to fetch login logs' });
  }
};

const getLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;
    
    const logs = await ActivityLog.getLogsByUser(userId, parseInt(limit));
    res.json(logs);
  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({ error: 'Failed to fetch user logs' });
  }
};

const getLogsByAction = async (req, res) => {
  try {
    const { action } = req.params;
    const { limit = 50 } = req.query;
    
    const logs = await ActivityLog.getLogsByAction(action, parseInt(limit));
    res.json(logs);
  } catch (error) {
    console.error('Error fetching action logs:', error);
    res.status(500).json({ error: 'Failed to fetch action logs' });
  }
};

const getLogStats = async (req, res) => {
  try {
    const stats = await ActivityLog.getLogStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching log stats:', error);
    res.status(500).json({ error: 'Failed to fetch log stats' });
  }
};

const clearOldLogs = async (req, res) => {
  try {
    const { daysOld = 30 } = req.query;
    const deletedCount = await ActivityLog.clearOldLogs(parseInt(daysOld));
    
    // Log the activity
    await ActivityLog.createLog({
      user_id: req.user.userId,
      action: 'logs_clear',
      description: `Cleared ${deletedCount} old logs (older than ${daysOld} days)`,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent')
    });
    
    res.json({ 
      success: true, 
      deletedCount, 
      message: `Cleared ${deletedCount} old logs` 
    });
  } catch (error) {
    console.error('Error clearing old logs:', error);
    res.status(500).json({ error: 'Failed to clear old logs' });
  }
};

const exportLogs = async (req, res) => {
  try {
    const { format = 'csv', startDate, endDate } = req.query;
    
    let logs;
    if (startDate && endDate) {
      logs = await ActivityLog.getLogsByDateRange(startDate, endDate, 1000);
    } else {
      logs = await ActivityLog.getLogs(1000, 0);
    }
    
    if (format === 'csv') {
      const csvData = logs.map(log => 
        `${log.log_id},${log.user_name || 'System'},${log.action},${log.description || ''},${log.timestamp},${log.ip_address || ''}`
      ).join('\n');
      
      const csvHeader = 'ID,User,Action,Description,Timestamp,IP Address\n';
      const fullCsv = csvHeader + csvData;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=activity-logs-${new Date().toISOString().split('T')[0]}.csv`);
      res.send(fullCsv);
    } else {
      res.json(logs);
    }
  } catch (error) {
    console.error('Error exporting logs:', error);
    res.status(500).json({ error: 'Failed to export logs' });
  }
};

// Settings management
const getSettings = async (req, res) => {
  try {
    // In a real app, you would fetch from a settings table
    const settings = {
      systemName: 'CowCo Cattle Management System',
      version: '1.0.0',
      logRetentionDays: 30,
      maxLoginAttempts: 5,
      sessionTimeout: 24,
      maintenanceMode: false
    };
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const newSettings = req.body;
    
    // In a real app, you would update a settings table
    // For now, just return success
    
    // Log the activity
    await ActivityLog.createLog({
      user_id: req.user.userId,
      action: 'settings_update',
      description: 'Updated system settings',
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent')
    });
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

// Helper function
const getPermissionsByRole = (role) => {
  switch (role) {
    case 'manager':
      return ['cattle', 'tasks', 'reports', 'analytics'];
    case 'vet':
      return ['cattle', 'health-records', 'health-alerts'];
    case 'worker':
      return ['cattle', 'tasks', 'checklist'];
    case 'admin':
      return ['all'];
    default:
      return [];
  }
};

// Debug function to check user role
const debugUserRole = async (req, res) => {
  try {
    const user = await User.getUserById(req.user.userId);
    res.json({
      jwtUser: req.user,
      dbUser: user,
      message: 'User information from JWT and database'
    });
  } catch (error) {
    console.error('Error fetching user for debug:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getActivityLogs,
  getLoginLogs,
  getLogsByUser,
  getLogsByAction,
  getLogStats,
  clearOldLogs,
  exportLogs,
  getSettings,
  updateSettings,
  debugUserRole
};
