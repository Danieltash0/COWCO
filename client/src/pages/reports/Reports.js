import React, { useState } from 'react';
import { useReports } from '../../api/useReports';
import Loader from '../../components/Loader';
import '../../styles/Reports.module.css';

const Reports = () => {
  const { reports, loading, error, generateReport, exportReport } = useReports();
  const [showGenerator, setShowGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'production',
    dateRange: 'month'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    
    const result = await generateReport(form);
    setGenerating(false);
    
    if (result.success) {
      setShowGenerator(false);
      setForm({
        title: '',
        type: 'production',
        dateRange: 'month'
      });
    }
  };

  const handleExport = async (reportId, format) => {
    const result = await exportReport(reportId, format);
    if (result.success) {
      alert(result.message);
    } else {
      alert('Export failed: ' + result.error);
    }
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'production': return '🥛';
      case 'health': return '🏥';
      case 'financial': return '💰';
      default: return '📊';
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="reports-container">
      <div className="page-header">
        <h2>Reports</h2>
        <button onClick={() => setShowGenerator(true)} className="btn btn-primary">
          Generate New Report
        </button>
      </div>

      <div className="reports-summary">
        <div className="summary-card">
          <h3>Total Reports</h3>
          <div className="summary-count">{reports.length}</div>
        </div>
        <div className="summary-card">
          <h3>Production Reports</h3>
          <div className="summary-count">
            {reports.filter(r => r.type === 'production').length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Health Reports</h3>
          <div className="summary-count">
            {reports.filter(r => r.type === 'health').length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Financial Reports</h3>
          <div className="summary-count">
            {reports.filter(r => r.type === 'financial').length}
          </div>
        </div>
      </div>

      <div className="reports-list">
        {reports.length === 0 ? (
          <div className="no-reports">
            <p>No reports found. Generate your first report to get started.</p>
          </div>
        ) : (
          reports.map(report => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <div className="report-info">
                  <h3>
                    {getReportTypeIcon(report.type)} {report.title}
                  </h3>
                  <div className="report-meta">
                    <span className="report-type">{report.type}</span>
                    <span className="report-date">{report.date}</span>
                    <span className="report-author">by {report.generatedBy}</span>
                  </div>
                </div>
                <div className="report-actions">
                  <button 
                    onClick={() => handleExport(report.id, 'pdf')}
                    className="btn btn-secondary"
                  >
                    Export PDF
                  </button>
                  <button 
                    onClick={() => handleExport(report.id, 'csv')}
                    className="btn btn-secondary"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="report-content">
                <div className="report-data">
                  {report.type === 'production' && (
                    <div className="data-grid">
                      <div className="data-item">
                        <span className="label">Total Milk:</span>
                        <span className="value">{report.data.totalMilk} L</span>
                      </div>
                      <div className="data-item">
                        <span className="label">Average per Cow:</span>
                        <span className="value">{report.data.averagePerCow} L</span>
                      </div>
                      <div className="data-item">
                        <span className="label">Top Producer:</span>
                        <span className="value">{report.data.topProducer}</span>
                      </div>
                      <div className="data-item">
                        <span className="label">Total Cattle:</span>
                        <span className="value">{report.data.totalCattle}</span>
                      </div>
                    </div>
                  )}

                  {report.type === 'health' && (
                    <div className="data-grid">
                      <div className="data-item">
                        <span className="label">Total Checkups:</span>
                        <span className="value">{report.data.totalCheckups}</span>
                      </div>
                      <div className="data-item">
                        <span className="label">Vaccinations:</span>
                        <span className="value">{report.data.vaccinations}</span>
                      </div>
                      <div className="data-item">
                        <span className="label">Treatments:</span>
                        <span className="value">{report.data.treatments}</span>
                      </div>
                      <div className="data-item">
                        <span className="label">Healthy Cattle:</span>
                        <span className="value">{report.data.healthyCattle}</span>
                      </div>
                    </div>
                  )}

                  {report.type === 'financial' && (
                    <div className="data-grid">
                      <div className="data-item">
                        <span className="label">Revenue:</span>
                        <span className="value">${report.data.revenue.toLocaleString()}</span>
                      </div>
                      <div className="data-item">
                        <span className="label">Expenses:</span>
                        <span className="value">${report.data.expenses.toLocaleString()}</span>
                      </div>
                      <div className="data-item">
                        <span className="label">Profit:</span>
                        <span className="value">${report.data.profit.toLocaleString()}</span>
                      </div>
                      <div className="data-item">
                        <span className="label">Profit Margin:</span>
                        <span className="value">{report.data.profitMargin}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showGenerator && (
        <div className="modal-overlay" onClick={() => setShowGenerator(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Generate New Report</h3>
              <button onClick={() => setShowGenerator(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleGenerate} className="report-form">
                <div className="form-group">
                  <label>Report Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter report title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Report Type *</label>
                  <select name="type" value={form.type} onChange={handleChange} required>
                    <option value="production">Production Report</option>
                    <option value="health">Health Report</option>
                    <option value="financial">Financial Report</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date Range *</label>
                  <select name="dateRange" value={form.dateRange} onChange={handleChange} required>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setShowGenerator(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={generating}>
                    {generating ? 'Generating...' : 'Generate Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
