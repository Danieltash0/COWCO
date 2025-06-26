const FinancialRecord = require('../models/FinancialRecord');

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
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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