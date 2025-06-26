const db = require('../utils/database');

exports.createReport = async (report) => {
  const [result] = await db.execute(
    'INSERT INTO reports (title, type, generated_by, data) VALUES (?, ?, ?, ?)',
    [report.title, report.type, report.generated_by, JSON.stringify(report.data)]
  );
  return result.insertId;
};

exports.getAllReports = async () => {
  const [rows] = await db.execute(`
    SELECT r.*, u.name as generated_by_name 
    FROM reports r 
    LEFT JOIN users u ON r.generated_by = u.user_id 
    ORDER BY r.created_at DESC
  `);
  
  // Parse JSON data
  return rows.map(row => ({
    ...row,
    data: row.data ? JSON.parse(row.data) : {}
  }));
};

exports.getReportById = async (id) => {
  const [rows] = await db.execute(`
    SELECT r.*, u.name as generated_by_name 
    FROM reports r 
    LEFT JOIN users u ON r.generated_by = u.user_id 
    WHERE r.report_id = ?
  `, [id]);
  
  if (rows[0]) {
    return {
      ...rows[0],
      data: rows[0].data ? JSON.parse(rows[0].data) : {}
    };
  }
  return null;
};

exports.deleteReport = async (id) => {
  await db.execute('DELETE FROM reports WHERE report_id = ?', [id]);
};

// Analytics functions
exports.getAnalytics = async () => {
  // Get basic analytics from existing data
  const [cattleCount] = await db.execute('SELECT COUNT(*) as count FROM cattle');
  const [taskStats] = await db.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as completed
    FROM tasks
  `);
  const [healthStats] = await db.execute('SELECT COUNT(*) as count FROM health_records');
  
  return {
    cattle: {
      total: cattleCount[0].count
    },
    tasks: {
      total: taskStats[0].total,
      completed: taskStats[0].completed,
      completionRate: taskStats[0].total > 0 ? Math.round((taskStats[0].completed / taskStats[0].total) * 100) : 0
    },
    health: {
      records: healthStats[0].count
    }
  };
};
