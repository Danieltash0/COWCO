const db = require('../utils/database');

exports.createUser = async (user) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [user.name, user.email, user.password_hash, user.role]
  );
  return result.insertId;
};

exports.getUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

exports.getUserById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE user_id = ?', [id]);
  return rows[0];
};

exports.getAllUsers = async () => {
  const [rows] = await db.execute('SELECT * FROM users');
  return rows;
};

exports.deleteUser = async (id) => {
  await db.execute('DELETE FROM users WHERE user_id = ?', [id]);
};
