const db = require('../utils/database');

exports.createCattle = async (cattle) => {
  const [result] = await db.execute(
    'INSERT INTO cattle (tag_number, name, breed, age, added_by) VALUES (?, ?, ?, ?, ?)',
    [cattle.tag_number, cattle.name, cattle.breed, cattle.age, cattle.added_by]
  );
  return result.insertId;
};

exports.getAllCattle = async () => {
  const [rows] = await db.execute('SELECT * FROM cattle');
  return rows;
};

exports.getCattleById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM cattle WHERE cattle_id = ?', [id]);
  return rows[0];
};

exports.updateCattle = async (id, cattle) => {
  await db.execute(
    'UPDATE cattle SET tag_number=?, name=?, breed=?, age=? WHERE cattle_id=?',
    [cattle.tag_number, cattle.name, cattle.breed, cattle.age, id]
  );
};

exports.deleteCattle = async (id) => {
  await db.execute('DELETE FROM cattle WHERE cattle_id = ?', [id]);
};
