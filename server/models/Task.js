const db = require('../utils/database');

exports.createTask = async (task) => {
  const [result] = await db.execute(
    'INSERT INTO tasks (assigned_to, assigned_by, task_description, due_date) VALUES (?, ?, ?, ?)',
    [task.assigned_to, task.assigned_by, task.task_description, task.due_date]
  );
  return result.insertId;
};

exports.getAllTasks = async () => {
  const [rows] = await db.execute('SELECT * FROM tasks ORDER BY due_date ASC');
  return rows;
};

exports.getTaskById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM tasks WHERE task_id = ?', [id]);
  return rows[0];
};

exports.updateTask = async (id, task) => {
  await db.execute(
    'UPDATE tasks SET assigned_to=?, assigned_by=?, task_description=?, is_completed=?, due_date=? WHERE task_id=?',
    [task.assigned_to, task.assigned_by, task.task_description, task.is_completed, task.due_date, id]
  );
};

exports.deleteTask = async (id) => {
  await db.execute('DELETE FROM tasks WHERE task_id = ?', [id]);
};

exports.completeTask = async (id) => {
  await db.execute(
    'UPDATE tasks SET is_completed = TRUE WHERE task_id = ?',
    [id]
  );
};

exports.getTasksByUser = async (userId) => {
  const [rows] = await db.execute('SELECT * FROM tasks WHERE assigned_to = ? ORDER BY due_date ASC', [userId]);
  return rows;
};
