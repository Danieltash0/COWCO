const db = require('../utils/database');

exports.createFinancialRecord = async (record) => {
  const [result] = await db.execute(
    'INSERT INTO financial_records (type, category, amount, description, date, payment_method, reference_number, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [record.type, record.category, record.amount, record.description, record.date, record.paymentMethod, record.reference, record.notes, record.createdBy]
  );
  return result.insertId;
};

exports.getAllFinancialRecords = async () => {
  const [rows] = await db.execute(`
    SELECT fr.*, u.name as created_by_name 
    FROM financial_records fr 
    LEFT JOIN users u ON fr.created_by = u.user_id 
    ORDER BY fr.date DESC, fr.created_at DESC
  `);
  return rows;
};

exports.getFinancialRecordById = async (id) => {
  const [rows] = await db.execute(`
    SELECT fr.*, u.name as created_by_name 
    FROM financial_records fr 
    LEFT JOIN users u ON fr.created_by = u.user_id 
    WHERE fr.record_id = ?
  `, [id]);
  return rows[0];
};

exports.updateFinancialRecord = async (id, record) => {
  await db.execute(
    'UPDATE financial_records SET type=?, category=?, amount=?, description=?, date=?, payment_method=?, reference_number=?, notes=?, status=? WHERE record_id=?',
    [record.type, record.category, record.amount, record.description, record.date, record.paymentMethod, record.reference, record.notes, record.status || 'completed', id]
  );
};

exports.deleteFinancialRecord = async (id) => {
  await db.execute('DELETE FROM financial_records WHERE record_id = ?', [id]);
};

exports.getAnalyticsSummary = async (dateRange = 'month') => {
  let dateFilter = '';
  const now = new Date();
  
  switch (dateRange) {
    case 'week':
      dateFilter = 'AND fr.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
      break;
    case 'month':
      dateFilter = 'AND fr.date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)';
      break;
    case 'quarter':
      dateFilter = 'AND fr.date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)';
      break;
    case 'year':
      dateFilter = 'AND fr.date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';
      break;
    default:
      dateFilter = 'AND fr.date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)';
  }

  // Get total income and expenses
  const [incomeResult] = await db.execute(`
    SELECT COALESCE(SUM(amount), 0) as total_income 
    FROM financial_records 
    WHERE type = 'income' ${dateFilter}
  `);
  
  const [expenseResult] = await db.execute(`
    SELECT COALESCE(SUM(amount), 0) as total_expenses 
    FROM financial_records 
    WHERE type = 'expense' ${dateFilter}
  `);

  // Get category breakdown for expenses
  const [categoryResult] = await db.execute(`
    SELECT category, COALESCE(SUM(amount), 0) as total_amount 
    FROM financial_records 
    WHERE type = 'expense' ${dateFilter}
    GROUP BY category 
    ORDER BY total_amount DESC
  `);

  const totalIncome = parseFloat(incomeResult[0].total_income);
  const totalExpenses = parseFloat(expenseResult[0].total_expenses);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  const categoryBreakdown = {};
  categoryResult.forEach(row => {
    categoryBreakdown[row.category] = parseFloat(row.total_amount);
  });

  return {
    totalIncome,
    totalExpenses,
    netProfit,
    profitMargin,
    categoryBreakdown
  };
};

exports.getFinancialRecordsByDateRange = async (startDate, endDate) => {
  const [rows] = await db.execute(`
    SELECT fr.*, u.name as created_by_name 
    FROM financial_records fr 
    LEFT JOIN users u ON fr.created_by = u.user_id 
    WHERE fr.date BETWEEN ? AND ?
    ORDER BY fr.date DESC, fr.created_at DESC
  `, [startDate, endDate]);
  return rows;
}; 