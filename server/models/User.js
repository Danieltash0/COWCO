const pool = require('../utils/database');

exports.createUser = async (user) => {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
    [user.name, user.email, user.password_hash, user.role, user.status || 'active']
  );
  return result.insertId;
};

exports.getUserByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

exports.getUserById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE user_id = ?', [id]);
  return rows[0];
};

exports.getAllUsers = async () => {
  const [rows] = await pool.execute('SELECT * FROM users ORDER BY created_at DESC');
  return rows;
};

exports.updateUser = async (id, userData) => {
  const { name, email, role, status, password_hash } = userData;
  let query = 'UPDATE users SET name = ?, email = ?, role = ?, status = ?';
  let params = [name, email, role, status];
  
  if (password_hash) {
    query += ', password_hash = ?';
    params.push(password_hash);
  }
  
  query += ' WHERE user_id = ?';
  params.push(id);
  
  const [result] = await pool.execute(query, params);
  return result.affectedRows > 0;
};

exports.updateUserStatus = async (id, status) => {
  const [result] = await pool.execute(
    'UPDATE users SET status = ? WHERE user_id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

exports.updateLastLogin = async (id) => {
  const [result] = await pool.execute(
    'UPDATE users SET last_login = NOW() WHERE user_id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

exports.deleteUser = async (id) => {
  const [result] = await pool.execute('DELETE FROM users WHERE user_id = ?', [id]);
  return result.affectedRows > 0;
};
