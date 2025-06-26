const db = require('../utils/database');

exports.createQRCode = async (qrData) => {
  const [result] = await db.execute(
    'INSERT INTO qr_codes (cattle_id, qr_data) VALUES (?, ?)',
    [qrData.cattle_id, qrData.qr_data]
  );
  return result.insertId;
};

exports.getAllQRCodes = async () => {
  const [rows] = await db.execute(`
    SELECT qr.*, c.name as cattle_name, c.tag_number 
    FROM qr_codes qr 
    LEFT JOIN cattle c ON qr.cattle_id = c.cattle_id 
    ORDER BY qr.generated_at DESC
  `);
  return rows;
};

exports.getQRCodeById = async (id) => {
  const [rows] = await db.execute(`
    SELECT qr.*, c.name as cattle_name, c.tag_number 
    FROM qr_codes qr 
    LEFT JOIN cattle c ON qr.cattle_id = c.cattle_id 
    WHERE qr.qr_id = ?
  `, [id]);
  return rows[0];
};

exports.getQRCodeByCattleId = async (cattleId) => {
  const [rows] = await db.execute(`
    SELECT qr.*, c.name as cattle_name, c.tag_number 
    FROM qr_codes qr 
    LEFT JOIN cattle c ON qr.cattle_id = c.cattle_id 
    WHERE qr.cattle_id = ?
  `, [cattleId]);
  return rows[0];
};

exports.deleteQRCode = async (id) => {
  await db.execute('DELETE FROM qr_codes WHERE qr_id = ?', [id]);
};

exports.deleteQRCodeByCattleId = async (cattleId) => {
  await db.execute('DELETE FROM qr_codes WHERE cattle_id = ?', [cattleId]);
};
