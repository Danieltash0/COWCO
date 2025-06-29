const db = require('../utils/database');

exports.createTask = async (task) => {
  const [result] = await db.execute(
    'INSERT INTO tasks (title, description, assigned_to, assigned_by, priority, category, status, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [task.title, task.description, task.assigned_to, task.assigned_by, task.priority, task.category, task.status, task.due_date]
  );
  return result.insertId;
};

exports.getAllTasks = async () => {
  const [rows] = await db.execute(`
    SELECT 
      t.*,
      u1.name as assigned_to_name,
      u2.name as assigned_by_name
    FROM tasks t
    LEFT JOIN users u1 ON t.assigned_to = u1.user_id
    LEFT JOIN users u2 ON t.assigned_by = u2.user_id
    ORDER BY t.due_date ASC
  `);
  return rows;
};

exports.getTaskById = async (id) => {
  const [rows] = await db.execute(`
    SELECT 
      t.*,
      u1.name as assigned_to_name,
      u2.name as assigned_by_name
    FROM tasks t
    LEFT JOIN users u1 ON t.assigned_to = u1.user_id
    LEFT JOIN users u2 ON t.assigned_by = u2.user_id
    WHERE t.task_id = ?
  `, [id]);
  return rows[0];
};

exports.updateTask = async (id, task) => {
  await db.execute(
    'UPDATE tasks SET title=?, description=?, assigned_to=?, assigned_by=?, priority=?, category=?, status=?, is_completed=?, due_date=? WHERE task_id=?',
    [task.title, task.description, task.assigned_to, task.assigned_by, task.priority, task.category, task.status, task.is_completed, task.due_date, id]
  );
};

exports.deleteTask = async (id) => {
  await db.execute('DELETE FROM tasks WHERE task_id = ?', [id]);
};

exports.completeTask = async (id) => {
  await db.execute(
    'UPDATE tasks SET status = "completed", is_completed = TRUE, completed_date = CURRENT_TIMESTAMP WHERE task_id = ?',
    [id]
  );
};

exports.getTasksByUser = async (userId) => {
  const [rows] = await db.execute('SELECT * FROM tasks WHERE assigned_to = ? ORDER BY due_date ASC', [userId]);
  return rows;
};
