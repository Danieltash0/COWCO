const db = require('../utils/database');

exports.getMilkingRecords = async (req, res) => {
  try {
    console.log('Fetching milking records...');
    const [rows] = await db.execute(`
      SELECT 
        mr.record_id,
        mr.cattle_id,
        mr.amount,
        mr.session_type,
        mr.milking_date,
        mr.notes,
        mr.recorded_by,
        c.name as cattle_name,
        c.tag_number,
        u.name as recorded_by_name
      FROM milking_records mr
      LEFT JOIN cattle c ON mr.cattle_id = c.cattle_id
      LEFT JOIN users u ON mr.recorded_by = u.user_id
      ORDER BY mr.milking_date DESC, mr.record_id DESC
    `);
    
    console.log('Milking records fetched:', rows.length, 'records');
    console.log('Sample record:', rows[0]);
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching milking records:', err);
    res.status(500).json({ error: 'Failed to fetch milking records' });
  }
};

exports.addMilkingRecord = async (req, res) => {
  try {
    const { cattle_id, amount, notes, session_type = 'morning' } = req.body;
    const recorded_by = req.user.userId; // Get from authenticated user
    
    // Validate required fields
    if (!cattle_id || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: cattle_id and amount are required' 
      });
    }
    
    // Validate session type
    const validSessionTypes = ['morning', 'afternoon', 'evening'];
    if (!validSessionTypes.includes(session_type)) {
      return res.status(400).json({ 
        error: 'Invalid session_type. Must be one of: morning, afternoon, evening' 
      });
    }
    
    const [result] = await db.execute(
      'INSERT INTO milking_records (cattle_id, amount, session_type, milking_date, notes, recorded_by) VALUES (?, ?, ?, CURRENT_DATE, ?, ?)',
      [cattle_id, amount, session_type, notes || null, recorded_by]
    );
    
    res.status(201).json({ 
      success: true, 
      record_id: result.insertId,
      message: 'Milking record added successfully' 
    });
  } catch (err) {
    console.error('Error adding milking record:', err);
    res.status(500).json({ error: 'Failed to add milking record' });
  }
};

exports.getMilkingStats = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const [stats] = await db.execute(`
      SELECT 
        COALESCE(SUM(amount), 0) as totalMilk,
        COALESCE(AVG(amount), 0) as averagePerSession,
        COUNT(*) as totalSessions,
        COUNT(DISTINCT cattle_id) as uniqueCattle
      FROM milking_records 
      WHERE milking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    `, [parseInt(period)]);
    
    const [topCattle] = await db.execute(`
      SELECT 
        c.name,
        c.tag_number,
        COALESCE(SUM(mr.amount), 0) as totalMilk,
        COUNT(mr.record_id) as sessions
      FROM cattle c
      LEFT JOIN milking_records mr ON c.cattle_id = mr.cattle_id 
        AND mr.milking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY c.cattle_id, c.name, c.tag_number
      ORDER BY totalMilk DESC
      LIMIT 5
    `, [parseInt(period)]);
    
    const [sessionTypeStats] = await db.execute(`
      SELECT 
        session_type,
        COUNT(*) as sessions,
        COALESCE(SUM(amount), 0) as totalMilk,
        COALESCE(AVG(amount), 0) as averageMilk
      FROM milking_records 
      WHERE milking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY session_type
      ORDER BY session_type
    `, [parseInt(period)]);
    
    res.json({
      totalMilk: parseFloat(stats[0].totalMilk),
      averagePerSession: parseFloat(stats[0].averagePerSession),
      totalSessions: stats[0].totalSessions,
      uniqueCattle: stats[0].uniqueCattle,
      topCattle: topCattle,
      sessionTypeStats: sessionTypeStats
    });
  } catch (err) {
    console.error('Error fetching milking stats:', err);
    res.status(500).json({ error: 'Failed to fetch milking statistics' });
  }
};

exports.deleteMilkingRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    
    const [result] = await db.execute(
      'DELETE FROM milking_records WHERE record_id = ?',
      [record_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Milking record not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Milking record deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting milking record:', err);
    res.status(500).json({ error: 'Failed to delete milking record' });
  }
};

exports.updateMilkingRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    const { cattle_id, amount, notes, session_type } = req.body;
    
    // Validate required fields
    if (!cattle_id || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: cattle_id and amount are required' 
      });
    }
    
    // Validate session type
    const validSessionTypes = ['morning', 'afternoon', 'evening'];
    if (session_type && !validSessionTypes.includes(session_type)) {
      return res.status(400).json({ 
        error: 'Invalid session_type. Must be one of: morning, afternoon, evening' 
      });
    }
    
    const [result] = await db.execute(
      'UPDATE milking_records SET cattle_id = ?, amount = ?, session_type = ?, notes = ? WHERE record_id = ?',
      [cattle_id, amount, session_type || 'morning', notes || null, record_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Milking record not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Milking record updated successfully' 
    });
  } catch (err) {
    console.error('Error updating milking record:', err);
    res.status(500).json({ error: 'Failed to update milking record' });
  }
}; 