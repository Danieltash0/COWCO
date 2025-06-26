const HealthRecord = require('../models/HealthRecord');

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

// Health Alerts - For now, we'll use a simple implementation
// In a real app, you might want a separate alerts table
exports.getHealthAlerts = async (req, res) => {
  try {
    // This is a simplified implementation
    // In a real app, you'd query upcoming vaccinations, treatments, etc.
    const alerts = [];
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
