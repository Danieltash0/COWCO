const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { hashPassword } = require('../utils/bcrypt');

const roleMapping = {
  'manager': 'Farm Manager',
  'vet': 'Veterinarian',
  'worker': 'Worker',
  'admin': 'Admin'
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    
    const formattedUsers = users.map(user => {
      const mappedRole = roleMapping[user.role] || user.role;
      return {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: mappedRole,
        status: user.status,
        lastLogin: user.last_login,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        permissions: getPermissionsByRole(user.role)
      };
    });
    
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash the password before storing
    const hashedPassword = await hashPassword(password || 'default123');
    const userId = await User.createUser({
      name,
      email,
      password_hash: hashedPassword,
      role: role,
      status: 'active'
    });
    
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
    
    if (!name || !email || !role || !status) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, role, and status are required' 
      });
    }
    
    const existingUser = await User.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updateData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role,
      status: status.toLowerCase()
    };
    
    if (password && password.trim()) {
      // Hash the new password before updating
      updateData.password_hash = await hashPassword(password);
    }
    
    const success = await User.updateUser(id, updateData);
    
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    
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
    
    const user = await User.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    const success = await User.deleteUser(id);
    
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    
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
    
    const user = await User.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }
    
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    const success = await User.updateUserStatus(id, newStatus);
    
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    
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

const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, user_id, action, start_date, end_date } = req.query;
    
    const logs = await ActivityLog.getLogs({
      page: parseInt(page),
      limit: parseInt(limit),
      user_id: user_id ? parseInt(user_id) : null,
      action,
      start_date,
      end_date
    });
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
};

const getLoginLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.getLogsByAction('login');
    res.json(logs);
  } catch (error) {
    console.error('Error fetching login logs:', error);
    res.status(500).json({ error: 'Failed to fetch login logs' });
  }
};

const getLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await ActivityLog.getLogsByUser(parseInt(userId));
    res.json(logs);
  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({ error: 'Failed to fetch user logs' });
  }
};

const getLogsByAction = async (req, res) => {
  try {
    const { action } = req.params;
    const logs = await ActivityLog.getLogsByAction(action);
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
    
    await ActivityLog.createLog({
      user_id: req.user.userId,
      action: 'logs_clear',
      description: `Cleared ${deletedCount} logs older than ${daysOld} days`,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent')
    });
    
    res.json({ 
      success: true, 
      message: `Cleared ${deletedCount} old logs`,
      deletedCount 
    });
  } catch (error) {
    console.error('Error clearing old logs:', error);
    res.status(500).json({ error: 'Failed to clear old logs' });
  }
};

const exportLogs = async (req, res) => {
  try {
    const { format = 'csv', start_date, end_date } = req.query;
    
    const logs = await ActivityLog.getAllLogs({ start_date, end_date });
    
    if (format === 'csv') {
      const csvHeaders = 'Timestamp,User,Action,Description,IP Address\n';
      const csvRows = logs.map(log => {
        return `${log.timestamp},${log.user_name || 'Unknown'},${log.action},"${log.description || ''}",${log.ip_address || ''}`;
      }).join('\n');
      
      const csvContent = csvHeaders + csvRows;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="activity-logs-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    } else {
      res.json(logs);
    }
  } catch (error) {
    console.error('Error exporting logs:', error);
    res.status(500).json({ error: 'Failed to export logs' });
  }
};

const getSettings = async (req, res) => {
  try {
    const settings = {
      systemName: 'CowCo Cattle Management System',
      version: '1.0.0',
      maintenanceMode: false,
      maxLoginAttempts: 5,
      sessionTimeout: 24,
      backupFrequency: 'daily',
      notificationSettings: {
        email: true,
        sms: false,
        push: false
      }
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
    
    await ActivityLog.createLog({
      user_id: req.user.userId,
      action: 'settings_update',
      description: 'System settings updated',
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent')
    });
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

const getPermissionsByRole = (role) => {
  switch (role) {
    case 'Farm Manager':
      return ['cattle', 'tasks', 'reports', 'analytics'];
    case 'Veterinarian':
      return ['cattle', 'health-records', 'health-alerts'];
    case 'Worker':
      return ['cattle', 'tasks', 'checklist'];
    case 'Admin':
      return ['all'];
    default:
      return [];
  }
};

const debugUserRole = async (req, res) => {
  try {
    res.json({
      user: req.user,
      role: req.user.role,
      permissions: getPermissionsByRole(req.user.role)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user role info' });
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
