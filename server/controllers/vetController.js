const HealthRecord = require('../models/HealthRecord');
const pool = require('../utils/database');

exports.createHealthRecord = async (req, res) => {
  try {
    const id = await HealthRecord.createHealthRecord(req.body);
    res.status(201).json({ record_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.getAllHealthRecords();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHealthRecordById = async (req, res) => {
  try {
    const record = await HealthRecord.getHealthRecordById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Health record not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateHealthRecord = async (req, res) => {
  try {
    await HealthRecord.updateHealthRecord(req.params.id, req.body);
    res.json({ message: 'Health record updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteHealthRecord = async (req, res) => {
  try {
    await HealthRecord.deleteHealthRecord(req.params.id);
    res.json({ message: 'Health record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHealthRecordsByCattle = async (req, res) => {
  try {
    const records = await HealthRecord.getHealthRecordsByCattle(req.params.cattleId);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Health Alerts
exports.createHealthAlert = async (req, res) => {
  try {
    const { cattle_id, type, description, due_date, priority, status } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO health_alerts (cattle_id, type, description, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [cattle_id, type, description, due_date, priority, status || 'pending']
    );
    
    res.status(201).json({ alert_id: result.insertId, message: 'Health alert created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHealthAlerts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ha.id, ha.cattle_id, c.name as cattle_name, ha.type, ha.description, 
             ha.due_date, ha.priority, ha.status, ha.created_at
      FROM health_alerts ha
      LEFT JOIN cattle c ON ha.cattle_id = c.cattle_id
      ORDER BY ha.due_date ASC
    `);
    
    const alerts = rows.map(alert => ({
      id: alert.id,
      cattle_id: alert.cattle_id,
      cattle_name: alert.cattle_name,
      type: alert.type,
      description: alert.description,
      due_date: alert.due_date,
      priority: alert.priority,
      status: alert.status,
      created_at: alert.created_at
    }));
    
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHealthAlertById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ha.id, ha.cattle_id, c.name as cattle_name, ha.type, ha.description, 
             ha.due_date, ha.priority, ha.status, ha.created_at
      FROM health_alerts ha
      LEFT JOIN cattle c ON ha.cattle_id = c.cattle_id
      WHERE ha.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Health alert not found' });
    }
    
    const alert = {
      id: rows[0].id,
      cattle_id: rows[0].cattle_id,
      cattle_name: rows[0].cattle_name,
      type: rows[0].type,
      description: rows[0].description,
      due_date: rows[0].due_date,
      priority: rows[0].priority,
      status: rows[0].status,
      created_at: rows[0].created_at
    };
    
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateHealthAlert = async (req, res) => {
  try {
    const { type, description, due_date, priority, status } = req.body;
    
    const [result] = await pool.query(
      'UPDATE health_alerts SET type = ?, description = ?, due_date = ?, priority = ?, status = ? WHERE id = ?',
      [type, description, due_date, priority, status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Health alert not found' });
    }
    
    res.json({ message: 'Health alert updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteHealthAlert = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM health_alerts WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Health alert not found' });
    }
    
    res.json({ message: 'Health alert deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
