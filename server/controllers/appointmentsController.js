const db = require('../utils/database');

exports.getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.*, c.name AS cattle_name, u.name AS vet_name
      FROM health_appointments a
      LEFT JOIN cattle c ON a.cattle_id = c.cattle_id
      LEFT JOIN users u ON a.vet_id = u.user_id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

exports.addAppointment = async (req, res) => {
  try {
    const { cattle_id, vet_id, appointment_date, appointment_time, reason, notes } = req.body;
    if (!cattle_id || !vet_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const [result] = await db.execute(
      'INSERT INTO health_appointments (cattle_id, vet_id, appointment_date, appointment_time, reason, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [cattle_id, vet_id, appointment_date, appointment_time, reason || null, notes || null]
    );
    res.status(201).json({ success: true, appointment_id: result.insertId });
  } catch (err) {
    console.error('Error adding appointment:', err);
    res.status(500).json({ error: 'Failed to add appointment' });
  }
}; 