const db = require('../utils/database');

// Get real-time production summary
exports.getProductionSummary = async (req, res) => {
  try {
    // Get total cattle count
    const [cattleResult] = await db.execute('SELECT COUNT(*) as total FROM cattle WHERE gender = "Female"');
    const totalCattle = cattleResult[0].total;

    // Get milking events
    const [milkingResult] = await db.execute(`
      SELECT COALESCE(SUM(amount), 0) as totalMilk, 
             COALESCE(AVG(amount), 0) as averagePerCow,
             COUNT(*) as milkingSessions
      FROM cattle_events 
      WHERE event_type = 'milking' 
      AND event_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    // Get top producer
    const [topProducerResult] = await db.execute(`
      SELECT c.name, COALESCE(SUM(ce.amount), 0) as totalMilk
      FROM cattle c
      LEFT JOIN cattle_events ce ON c.cattle_id = ce.cattle_id AND ce.event_type = 'milking'
      WHERE c.gender = 'Female'
      GROUP BY c.cattle_id, c.name
      ORDER BY totalMilk DESC
      LIMIT 1
    `);

    const topProducer = topProducerResult.length > 0 ? topProducerResult[0].name : 'No data';

    res.json({
      totalCattle,
      totalMilk: parseFloat(milkingResult[0].totalMilk),
      averagePerCow: parseFloat(milkingResult[0].averagePerCow),
      topProducer,
      milkingSessions: milkingResult[0].milkingSessions
    });
  } catch (error) {
    console.error('Error getting production summary:', error);
    res.status(500).json({ error: 'Failed to fetch production summary' });
  }
};

// Get real-time health summary
exports.getHealthSummary = async (req, res) => {
  try {
    // Get total health records
    const [healthResult] = await db.execute(`
      SELECT COUNT(*) as totalCheckups
      FROM health_records 
      WHERE record_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    // Get vaccinations count
    const [vaccinationResult] = await db.execute(`
      SELECT COUNT(*) as vaccinations
      FROM health_records 
      WHERE vaccination IS NOT NULL AND vaccination != ''
      AND record_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    // Get treatments count
    const [treatmentResult] = await db.execute(`
      SELECT COUNT(*) as treatments
      FROM health_records 
      WHERE treatment IS NOT NULL AND treatment != ''
      AND record_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    // Get healthy cattle count
    const [healthyResult] = await db.execute(`
      SELECT COUNT(*) as healthyCattle
      FROM cattle 
      WHERE health IN ('Excellent', 'Good')
    `);

    res.json({
      totalCheckups: healthResult[0].totalCheckups,
      vaccinations: vaccinationResult[0].vaccinations,
      treatments: treatmentResult[0].treatments,
      healthyCattle: healthyResult[0].healthyCattle
    });
  } catch (error) {
    console.error('Error getting health summary:', error);
    res.status(500).json({ error: 'Failed to fetch health summary' });
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
    console.error('Error getting financial summary:', error);
    res.status(500).json({ error: 'Failed to fetch financial summary' });
  }
}; 