import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../api/useAnalytics';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import '../../styles/Analytics.module.css';

const Analytics = () => {
  const { 
    financialRecords, 
    loading, 
    error, 
    addFinancialRecord, 
    updateFinancialRecord, 
    deleteFinancialRecord,
    getAnalytics,
    exportFinancialReport
  } = useAnalytics();

  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [analytics, setAnalytics] = useState(null);
  const [form, setForm] = useState({
    type: 'income',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    reference: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    const data = await getAnalytics(dateRange);
    setAnalytics(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const result = editingRecord 
      ? await updateFinancialRecord(editingRecord.record_id, form)
      : await addFinancialRecord(form);
    
    setSubmitting(false);
    
    if (result.success) {
      setShowModal(false);
      setEditingRecord(null);
      setForm({
        type: 'income',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        reference: '',
        notes: ''
      });
      loadAnalytics();
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setForm({
      type: record.type,
      category: record.category,
      amount: record.amount,
      description: record.description,
      date: record.date,
      paymentMethod: record.payment_method || 'cash',
      reference: record.reference_number || '',
      notes: record.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this financial record?')) {
      await deleteFinancialRecord(recordId);
      loadAnalytics();
    }
  };

  const handleExport = async () => {
    await exportFinancialReport(dateRange);
  };

  const getCategoryOptions = (type) => {
    if (type === 'income') {
      return [
        'Milk Sales',
        'Cattle Sales',
        'Equipment Sales',
        'Government Grants',
        'Insurance Claims',
        'Other Income'
      ];
    } else {
      return [
        'Feed & Nutrition',
        'Veterinary Care',
        'Equipment & Maintenance',
        'Labor & Wages',
        'Utilities',
        'Insurance',
        'Transportation',
        'Marketing',
        'Other Expenses'
      ];
    }
  };

  const getTypeColor = (type) => {
    return type === 'income' ? 'green' : 'red';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const filteredRecords = financialRecords.filter(record => {
    const matchesFilter = filter === 'all' || record.type === filter;
    return matchesFilter;
  });

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="analytics-container">
      <div className="page-header">
        <h2>Financial Analytics</h2>
        <div className="header-actions">
          <button onClick={handleExport} className="btn btn-secondary">
            Export Report
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      {analytics && (
        <div className="analytics-summary">
          <div className="summary-card">
            <h3>Total Revenue</h3>
            <div className="summary-amount green">
              KSHS {analytics.totalIncome.toLocaleString()}
            </div>
          </div>
          <div className="summary-card">
            <h3>Total Expenses</h3>
            <div className="summary-amount red">
              KSHS {analytics.totalExpenses.toLocaleString()}
            </div>
          </div>
          <div className="summary-card">
            <h3>Net Profit</h3>
            <div className={`summary-amount ${analytics.netProfit >= 0 ? 'green' : 'red'}`}>
              KSHS {analytics.netProfit.toLocaleString()}
            </div>
          </div>
          <div className="summary-card">
            <h3>Profit Margin</h3>
            <div className={`summary-amount ${analytics.profitMargin >= 0 ? 'green' : 'red'}`}>
              {analytics.profitMargin.toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="analytics-filters">
        <div className="filter-group">
          <label>Record Type:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Records</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Financial Records Table */}
      <div className="financial-records">
        <h3>Financial Records</h3>
        <div className="records-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-records">
                    No financial records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.record_id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`type-badge ${getTypeColor(record.type)}`}>
                        {record.type}
                      </span>
                    </td>
                    <td>{record.category}</td>
                    <td>{record.description}</td>
                    <td className={`amount ${getTypeColor(record.type)}`}>
                      KSHS {parseFloat(record.amount).toLocaleString()}
                    </td>
                    <td>{record.payment_method}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEdit(record)}
                          className="btn btn-small btn-secondary"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(record.record_id)}
                          className="btn btn-small btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Add Financial Record
          </button>
        </div>
      </div>

      {/* Charts Section - Commented Out */}
      {/* {analytics && (
        <div className="charts-section">
          <h3>Financial Charts</h3>
          <div className="charts-grid">
            <div className="chart-card">
              <h4>Income vs Expenses</h4>
              <div className="chart-placeholder">
                <p>Chart showing income vs expenses over time</p>
                <div className="chart-data">
                  <div className="chart-bar income" style={{height: `${(analytics.totalIncome / (analytics.totalIncome + analytics.totalExpenses)) * 100}%`}}>
                    Income: KSHS {analytics.totalIncome.toLocaleString()}
                  </div>
                  <div className="chart-bar expense" style={{height: `${(analytics.totalExpenses / (analytics.totalIncome + analytics.totalExpenses)) * 100}%`}}>
                    Expenses: KSHS {analytics.totalExpenses.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="chart-card">
              <h4>Category Breakdown</h4>
              <div className="chart-placeholder">
                <p>Chart showing expenses by category</p>
                <div className="category-breakdown">
                  {analytics.categoryBreakdown && Object.entries(analytics.categoryBreakdown).map(([category, amount]) => (
                    <div key={category} className="category-item">
                      <span className="category-name">{category}</span>
                      <span className="category-amount">KSHS {amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Financial Record Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingRecord(null);
          setForm({
            type: 'income',
            category: '',
            amount: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'cash',
            reference: '',
            notes: ''
          });
        }}
        title={editingRecord ? 'Edit Financial Record' : 'Add Financial Record'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="financial-form">
          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select name="type" value={form.type} onChange={handleChange} required>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {getCategoryOptions(form.type).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Payment Method</label>
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="check">Check</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reference Number</label>
              <input
                type="text"
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder="Invoice/Receipt number"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Additional notes or comments"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : (editingRecord ? 'Update Record' : 'Add Record')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Analytics;
