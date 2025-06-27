const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { pool } = require('../utils/database');

// User Management
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, email, role, status, last_login, created_at, 
             CASE 
               WHEN role = 'Farm Manager' THEN 'cattle,tasks,reports,analytics'
               WHEN role = 'Veterinarian' THEN 'cattle,health-records,health-alerts'
               WHEN role = 'Worker' THEN 'cattle,tasks,checklist'
               WHEN role = 'Admin' THEN 'all'
               ELSE ''
             END as permissions
      FROM users 
      ORDER BY created_at DESC
    `);
    
    const users = rows.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.last_login,
      createdAt: user.created_at,
      permissions: user.permissions ? user.permissions.split(',') : []
    }));
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, password, role, 'active']
    );
    
    // Log the activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, description, timestamp) VALUES (?, ?, ?, NOW())',
      [req.user.id, 'user_create', `Created new user: ${name} (${email})`]
    );
    
    res.status(201).json({ 
      success: true, 
      userId: result.insertId,
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
    const { name, email, role, status } = req.body;
    
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?',
      [name, email, role, status, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Log the activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, description, timestamp) VALUES (?, ?, ?, NOW())',
      [req.user.id, 'user_update', `Updated user: ${name} (${email})`]
    );
    
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
    const [userRows] = await pool.query('SELECT name, email FROM users WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Log the activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, description, timestamp) VALUES (?, ?, ?, NOW())',
      [req.user.id, 'user_delete', `Deleted user: ${userRows[0].name} (${userRows[0].email})`]
    );
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current status
    const [userRows] = await pool.query('SELECT status, name, email FROM users WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const newStatus = userRows[0].status === 'active' ? 'inactive' : 'active';
    
    const [result] = await pool.query(
      'UPDATE users SET status = ? WHERE id = ?',
      [newStatus, id]
    );
    
    // Log the activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, description, timestamp) VALUES (?, ?, ?, NOW())',
      [req.user.id, 'user_status_toggle', `Changed status of ${userRows[0].name} to ${newStatus}`]
    );
    
    res.json({ success: true, status: newStatus, message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

// Activity Logs
const getActivityLogs = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT al.id, al.user_id, u.name as user_name, al.action, al.description, al.timestamp
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.timestamp DESC
      LIMIT 100
    `);
    
    const logs = rows.map(log => ({
      id: log.id,
      userId: log.user_id,
      userName: log.user_name || 'System',
      action: log.action,
      description: log.description,
      timestamp: log.timestamp
    }));
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
};

const getLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [rows] = await pool.query(`
      SELECT al.id, al.user_id, u.name as user_name, al.action, al.description, al.timestamp
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.user_id = ?
      ORDER BY al.timestamp DESC
    `, [userId]);
    
    const logs = rows.map(log => ({
      id: log.id,
      userId: log.user_id,
      userName: log.user_name || 'System',
      action: log.action,
      description: log.description,
      timestamp: log.timestamp
    }));
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({ error: 'Failed to fetch user logs' });
  }
};

const getLogsByAction = async (req, res) => {
  try {
    const { action } = req.params;
    
    const [rows] = await pool.query(`
      SELECT al.id, al.user_id, u.name as user_name, al.action, al.description, al.timestamp
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.action = ?
      ORDER BY al.timestamp DESC
    `, [action]);
    
    const logs = rows.map(log => ({
      id: log.id,
      userId: log.user_id,
      userName: log.user_name || 'System',
      action: log.action,
      description: log.description,
      timestamp: log.timestamp
    }));
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching action logs:', error);
    res.status(500).json({ error: 'Failed to fetch action logs' });
  }
};

const exportLogs = async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    
    const [rows] = await pool.query(`
      SELECT al.id, u.name as user_name, al.action, al.description, al.timestamp
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.timestamp DESC
    `);
    
    if (format === 'csv') {
      const csvData = rows.map(log => 
        `${log.id},${log.user_name || 'System'},${log.action},${log.description},${log.timestamp}`
      ).join('\n');
      
      const csvHeader = 'ID,User,Action,Description,Timestamp\n';
      const fullCsv = csvHeader + csvData;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=activity-logs-${new Date().toISOString().split('T')[0]}.csv`);
      res.send(fullCsv);
    } else {
      res.json(rows);
    }
  } catch (error) {
    console.error('Error exporting logs:', error);
    res.status(500).json({ error: 'Failed to export logs' });
  }
};

// Settings
const getSettings = async (req, res) => {
  try {
    // For now, return default settings
    // In a real app, these would be stored in a settings table
    const settings = {
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      reminders: {
        vaccination: 7,
        healthCheck: 30,
        milking: 1
      },
      backup: {
        autoBackup: true,
        backupFrequency: 'daily',
        retentionDays: 30
      },
      security: {
        sessionTimeout: 30,
        requireMFA: false,
        passwordExpiry: 90
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
    
    // In a real app, you would update a settings table
    // For now, just return success
    
    // Log the activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, description, timestamp) VALUES (?, ?, ?, NOW())',
      [req.user.id, 'settings_update', 'Updated system settings']
    );
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getActivityLogs,
  getLogsByUser,
  getLogsByAction,
  exportLogs,
  getSettings,
  updateSettings
};
