const FinancialRecord = require('../models/FinancialRecord');
const db = require('../utils/database');

exports.getAllFinancialRecords = async (req, res) => {
  try {
    const records = await FinancialRecord.getAllFinancialRecords();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFinancialRecordById = async (req, res) => {
  try {
    const record = await FinancialRecord.getFinancialRecordById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Financial record not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createFinancialRecord = async (req, res) => {
  try {
    const recordData = {
      ...req.body,
      createdBy: req.user.userId
    };
    
    const id = await FinancialRecord.createFinancialRecord(recordData);
    res.status(201).json({ record_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFinancialRecord = async (req, res) => {
  try {
    await FinancialRecord.updateFinancialRecord(req.params.id, req.body);
    res.json({ message: 'Financial record updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFinancialRecord = async (req, res) => {
  try {
    await FinancialRecord.deleteFinancialRecord(req.params.id);
    res.json({ message: 'Financial record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAnalyticsSummary = async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    const summary = await FinancialRecord.getAnalyticsSummary(range);
    
    // Add milking data to the summary
    const milkingData = await getMilkingAnalytics(range);
    
    res.json({
      ...summary,
      milking: milkingData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper function to get milking analytics
async function getMilkingAnalytics(range = 'month') {
  try {
    let days;
    switch (range) {
      case 'week':
        days = 7;
        break;
      case 'month':
        days = 30;
        break;
      case 'quarter':
        days = 90;
        break;
      case 'year':
        days = 365;
        break;
      default:
        days = 30;
    }

    // Get overall milking statistics
    const [milkingStats] = await db.execute(`
      SELECT 
        COALESCE(SUM(amount), 0) as totalMilk,
        COALESCE(AVG(amount), 0) as averagePerSession,
        COUNT(*) as totalSessions,
        COUNT(DISTINCT cattle_id) as uniqueCattle,
        COUNT(DISTINCT DATE(milking_date)) as milkingDays
      FROM milking_records 
      WHERE milking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    `, [days]);

    // Get top producing cattle
    const [topCattle] = await db.execute(`
      SELECT 
        c.name,
        c.tag_number,
        COALESCE(SUM(mr.amount), 0) as totalMilk,
        COUNT(mr.record_id) as sessions,
        COALESCE(AVG(mr.amount), 0) as averageMilk
      FROM cattle c
      LEFT JOIN milking_records mr ON c.cattle_id = mr.cattle_id 
        AND mr.milking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY c.cattle_id, c.name, c.tag_number
      HAVING totalMilk > 0
      ORDER BY totalMilk DESC
      LIMIT 5
    `, [days]);

    // Get session type breakdown
    const [sessionStats] = await db.execute(`
      SELECT 
        session_type,
        COUNT(*) as sessions,
        COALESCE(SUM(amount), 0) as totalMilk,
        COALESCE(AVG(amount), 0) as averageMilk
      FROM milking_records 
      WHERE milking_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY session_type
      ORDER BY session_type
    `, [days]);

    // Get daily production trend (last 7 days)
    const [dailyTrend] = await db.execute(`
      SELECT 
        DATE(milking_date) as date,
        COUNT(*) as sessions,
        COALESCE(SUM(amount), 0) as totalMilk,
        COALESCE(AVG(amount), 0) as averageMilk
      FROM milking_records 
      WHERE milking_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(milking_date)
      ORDER BY date DESC
      LIMIT 7
    `, []);

    return {
      totalMilk: parseFloat(milkingStats[0].totalMilk),
      averagePerSession: parseFloat(milkingStats[0].averagePerSession),
      totalSessions: milkingStats[0].totalSessions,
      uniqueCattle: milkingStats[0].uniqueCattle,
      milkingDays: milkingStats[0].milkingDays,
      averageDailyProduction: milkingStats[0].milkingDays > 0 ? 
        parseFloat(milkingStats[0].totalMilk) / milkingStats[0].milkingDays : 0,
      topCattle: topCattle,
      sessionStats: sessionStats,
      dailyTrend: dailyTrend
    };
  } catch (err) {
    console.error('Error getting milking analytics:', err);
    return {
      totalMilk: 0,
      averagePerSession: 0,
      totalSessions: 0,
      uniqueCattle: 0,
      milkingDays: 0,
      averageDailyProduction: 0,
      topCattle: [],
      sessionStats: [],
      dailyTrend: []
    };
  }
}

exports.exportFinancialReport = async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    const records = await FinancialRecord.getAllFinancialRecords();
    
    // Create CSV content
    const csvHeaders = 'Date,Type,Category,Description,Amount,Payment Method,Reference,Status,Created By\n';
    const csvRows = records.map(record => {
      return `${record.date},${record.type},${record.category},"${record.description}",${record.amount},${record.payment_method || ''},${record.reference_number || ''},${record.status},${record.created_by_name || ''}`;
    }).join('\n');
    
    const csvContent = csvHeaders + csvRows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="financial-report-${range}-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFinancialRecordsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const records = await FinancialRecord.getFinancialRecordsByDateRange(startDate, endDate);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 