const db = require('../utils/database');

// Get real-time production summary
exports.getProductionSummary = async (req, res) => {
  try {
    // Get total cattle count
    const [cattleResult] = await db.execute('SELECT COUNT(*) as total FROM cattle WHERE gender = "Female"');
    const totalCattle = cattleResult[0].total;

    // Get milking records (last 30 days)
    const [milkingResult] = await db.execute(`
      SELECT COALESCE(SUM(amount), 0) as totalMilk, 
             COALESCE(AVG(amount), 0) as averagePerSession,
             COUNT(*) as milkingSessions
      FROM milking_records
      WHERE milking_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    // Get top producer (last 30 days)
    const [topProducerResult] = await db.execute(`
      SELECT c.name, COALESCE(SUM(mr.amount), 0) as totalMilk
      FROM cattle c
      LEFT JOIN milking_records mr ON c.cattle_id = mr.cattle_id
        AND mr.milking_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      WHERE c.gender = 'Female'
      GROUP BY c.cattle_id, c.name
      ORDER BY totalMilk DESC
      LIMIT 1
    `);

    const topProducer = topProducerResult.length > 0 ? topProducerResult[0].name : 'No data';

    res.json({
      totalCattle,
      totalMilk: parseFloat(milkingResult[0].totalMilk),
      averagePerSession: parseFloat(milkingResult[0].averagePerSession),
      topProducer,
      milkingSessions: milkingResult[0].milkingSessions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch production summary' });
  }
};

// Get real-time health summary
exports.getHealthSummary = async (req, res) => {
  try {
    // Number of cattle for each health status
    const [statusCounts] = await db.execute(`
      SELECT health, COUNT(*) as count
      FROM cattle
      GROUP BY health
    `);

    // Number of appointments
    const [appointmentsResult] = await db.execute(`
      SELECT COUNT(*) as totalAppointments
      FROM health_appointments
    `);

    // Number of users with vet role
    const [vetCountResult] = await db.execute(`
      SELECT COUNT(*) as vetCount
      FROM users
      WHERE role = 'vet' OR role = 'Veterinarian'
    `);

    res.json({
      healthStatusCounts: statusCounts,
      totalAppointments: appointmentsResult[0].totalAppointments,
      vetCount: vetCountResult[0].vetCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medical summary' });
  }
};

// Get real-time financial summary
exports.getFinancialSummary = async (req, res) => {
  try {
    // Get total income and expenses for current month
    const [incomeResult] = await db.execute(`
      SELECT COALESCE(SUM(amount), 0) as totalIncome
      FROM financial_records 
      WHERE type = 'income' 
      AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    const [expenseResult] = await db.execute(`
      SELECT COALESCE(SUM(amount), 0) as totalExpenses
      FROM financial_records 
      WHERE type = 'expense' 
      AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    const totalIncome = parseFloat(incomeResult[0].totalIncome);
    const totalExpenses = parseFloat(expenseResult[0].totalExpenses);
    const profit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

    // Get category breakdown
    const [categoryResult] = await db.execute(`
      SELECT category, COALESCE(SUM(amount), 0) as total
      FROM financial_records 
      WHERE type = 'expense' 
      AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY category
      ORDER BY total DESC
      LIMIT 5
    `);

    res.json({
      revenue: totalIncome,
      expenses: totalExpenses,
      profit,
      profitMargin: Math.round(profitMargin * 100) / 100,
      topExpenseCategories: categoryResult
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch financial summary' });
  }
}; 