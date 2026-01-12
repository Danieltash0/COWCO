const pool = require('../utils/database');

exports.createLog = async (logData) => {
  const { user_id, action, description, ip_address, user_agent } = logData;
  const [result] = await pool.execute(
    'INSERT INTO activity_logs (user_id, action, description, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
    [user_id, action, description, ip_address, user_agent]
  );
  return result.insertId;
};

exports.getLogs = async (options = {}) => {
  const { page = 1, limit = 50, user_id, action, start_date, end_date } = options;
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT al.*, u.name as user_name, u.email as user_email
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.user_id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (user_id) {
    query += ' AND al.user_id = ?';
    params.push(user_id);
  }
  
  if (action) {
    query += ' AND al.action = ?';
    params.push(action);
  }
  
  if (start_date) {
    query += ' AND DATE(al.timestamp) >= ?';
    params.push(start_date);
  }
  
  if (end_date) {
    query += ' AND DATE(al.timestamp) <= ?';
    params.push(end_date);
  }
  
  query += ' ORDER BY al.timestamp DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  
  const [rows] = await pool.execute(query, params);
  return rows;
};

exports.getLogsByUser = async (userId, limit = 50) => {
  const [rows] = await pool.execute(`
    SELECT al.*, u.name as user_name, u.email as user_email
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.user_id
    WHERE al.user_id = ?
    ORDER BY al.timestamp DESC
    LIMIT ?
  `, [userId, limit]);
  return rows;
};

exports.getLogsByAction = async (action, limit = 50) => {
  const [rows] = await pool.execute(`
    SELECT al.*, u.name as user_name, u.email as user_email
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.user_id
    WHERE al.action = ?
    ORDER BY al.timestamp DESC
    LIMIT ?
  `, [action, limit]);
  return rows;
};

exports.getLoginLogs = async (limit = 50) => {
  const [rows] = await pool.execute(`
    SELECT al.*, u.name as user_name, u.email as user_email
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.user_id
    WHERE al.action IN ('login', 'logout')
    ORDER BY al.timestamp DESC
    LIMIT ?
  `, [limit]);
  return rows;
};

exports.getLogsByDateRange = async (startDate, endDate, limit = 100) => {
  const [rows] = await pool.execute(`
    SELECT al.*, u.name as user_name, u.email as user_email
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.user_id
    WHERE DATE(al.timestamp) BETWEEN ? AND ?
    ORDER BY al.timestamp DESC
    LIMIT ?
  `, [startDate, endDate, limit]);
  return rows;
};

exports.clearOldLogs = async (daysOld = 30) => {
  const [result] = await pool.execute(
    'DELETE FROM activity_logs WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)',
    [daysOld]
  );
  return result.affectedRows;
};

exports.getAllLogs = async (options = {}) => {
  const { start_date, end_date } = options;
  
  let query = `
    SELECT al.*, u.name as user_name, u.email as user_email
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.user_id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (start_date) {
    query += ' AND DATE(al.timestamp) >= ?';
    params.push(start_date);
  }
  
  if (end_date) {
    query += ' AND DATE(al.timestamp) <= ?';
    params.push(end_date);
  }
  
  query += ' ORDER BY al.timestamp DESC';
  
  const [rows] = await pool.execute(query, params);
  return rows;
};

exports.getLogStats = async () => {
  const [rows] = await pool.execute(`
    SELECT 
      COUNT(*) as total_logs,
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(CASE WHEN action = 'login' THEN 1 END) as login_count,
      COUNT(CASE WHEN action = 'logout' THEN 1 END) as logout_count,
      COUNT(CASE WHEN action LIKE '%error%' THEN 1 END) as error_count
    FROM activity_logs
    WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
  `);
  return rows[0];
};
