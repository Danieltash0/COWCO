const db = require('../utils/database');

exports.createHealthRecord = async (record) => {
  const [result] = await db.execute(
    'INSERT INTO health_records (cattle_id, vet_id, treatment, medical_procedure, diagnosis, record_date) VALUES (?, ?, ?, ?, ?, ?)',
    [record.cattle_id, record.vet_id, record.treatment, record.medical_procedure, record.diagnosis, record.record_date]
  );
  return result.insertId;
};

exports.getAllHealthRecords = async () => {
  const [rows] = await db.execute(`
    SELECT hr.*, c.name as cattle_name, u.name as vet_name 
    FROM health_records hr 
    LEFT JOIN cattle c ON hr.cattle_id = c.cattle_id 
    LEFT JOIN users u ON hr.vet_id = u.user_id 
    ORDER BY hr.record_date DESC
  `);
  return rows;
};

exports.getHealthRecordById = async (id) => {
  const [rows] = await db.execute(`
    SELECT hr.*, c.name as cattle_name, u.name as vet_name 
    FROM health_records hr 
    LEFT JOIN cattle c ON hr.cattle_id = c.cattle_id 
    LEFT JOIN users u ON hr.vet_id = u.user_id 
    WHERE hr.record_id = ?
  `, [id]);
  return rows[0];
};

exports.updateHealthRecord = async (id, record) => {
  await db.execute(
    'UPDATE health_records SET cattle_id=?, vet_id=?, treatment=?, medical_procedure=?, diagnosis=?, record_date=? WHERE record_id=?',
    [record.cattle_id, record.vet_id, record.treatment, record.medical_procedure, record.diagnosis, record.record_date, id]
  );
};

exports.deleteHealthRecord = async (id) => {
  await db.execute('DELETE FROM health_records WHERE record_id = ?', [id]);
};

exports.getHealthRecordsByCattle = async (cattleId) => {
  const [rows] = await db.execute(`
    SELECT hr.*, c.name as cattle_name, u.name as vet_name 
    FROM health_records hr 
    LEFT JOIN cattle c ON hr.cattle_id = c.cattle_id 
    LEFT JOIN users u ON hr.vet_id = u.user_id 
    WHERE hr.cattle_id = ? 
    ORDER BY hr.record_date DESC
  `, [cattleId]);
  return rows;
};
