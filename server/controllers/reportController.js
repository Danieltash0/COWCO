const Report = require('../models/Report');

exports.createReport = async (req, res) => {
  try {
    const id = await Report.createReport(req.body);
    res.status(201).json({ report_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.getAllReports();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    await Report.deleteReport(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await Report.getAnalytics();
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.exportReport = async (req, res) => {
  try {
    const { format } = req.body;
    const reportId = req.params.id;
    
    // In a real app, you would generate the actual file here
    // For now, just return a success message
    res.json({ 
      message: `Report ${reportId} exported successfully as ${format.toUpperCase()}` 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
