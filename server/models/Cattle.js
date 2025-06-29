const db = require('../utils/database');

exports.createCattle = async (cattle) => {
  // Generate a unique tag number if not provided
  const tagNumber = cattle.tag_number || `CT${Date.now()}`;
  
  // Validate and sanitize input data
  const cattleData = {
    tag_number: tagNumber,
    name: cattle.name || null,
    breed: cattle.breed || null,
    health: cattle.health || 'Good',
    gender: cattle.gender || 'Female',
    date_of_birth: cattle.date_of_birth || null,
    notes: cattle.notes || null,
    added_by: cattle.added_by || 1 // Default to admin user
  };

  const [result] = await db.execute(
    'INSERT INTO cattle (tag_number, name, breed, health, gender, date_of_birth, notes, added_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      cattleData.tag_number,
      cattleData.name,
      cattleData.breed,
      cattleData.health,
      cattleData.gender,
      cattleData.date_of_birth,
      cattleData.notes,
      cattleData.added_by
    ]
  );
  return result.insertId;
};

exports.getAllCattle = async () => {
  const [rows] = await db.execute('SELECT cattle_id, tag_number, name, breed, health, gender, date_of_birth, notes, added_by, created_at FROM cattle');
  return rows;
};

exports.getCattleById = async (id) => {
  const [rows] = await db.execute('SELECT cattle_id, tag_number, name, breed, health, gender, date_of_birth, notes, added_by, created_at FROM cattle WHERE cattle_id = ?', [id]);
  return rows[0];
};

exports.updateCattle = async (id, cattle) => {
  // Validate and sanitize input data
  const cattleData = {
    tag_number: cattle.tag_number || null,
    name: cattle.name || null,
    breed: cattle.breed || null,
    health: cattle.health || 'Good',
    gender: cattle.gender || 'Female',
    date_of_birth: cattle.date_of_birth || null,
    notes: cattle.notes || null
  };

  await db.execute(
    'UPDATE cattle SET tag_number=?, name=?, breed=?, health=?, gender=?, date_of_birth=?, notes=? WHERE cattle_id=?',
    [
      cattleData.tag_number,
      cattleData.name,
      cattleData.breed,
      cattleData.health,
      cattleData.gender,
      cattleData.date_of_birth,
      cattleData.notes,
      id
    ]
  );
};

exports.deleteCattle = async (id) => {
  await db.execute('DELETE FROM cattle WHERE cattle_id = ?', [id]);
};
