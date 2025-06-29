import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import '../../styles/Milking.module.css';

const Milking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [milkingRecords, setMilkingRecords] = useState([]);
  const [cattle, setCattle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedCattle, setSelectedCattle] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    cattle_id: '',
    amount: '',
    notes: '',
    session_type: 'morning',
    milking_date: new Date().toISOString().split('T')[0] // Default to today
  });

  useEffect(() => {
    fetchMilkingRecords();
    fetchCattle();
  }, []);

  const fetchMilkingRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/milking/records', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched milking records:', data); // Debug log
        setMilkingRecords(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch milking records');
      }
    } catch (err) {
      setError('Failed to load milking records: ' + err.message);
      console.error('Error fetching milking records:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCattle = async () => {
    try {
      const response = await fetch('/api/cattle', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCattle(data);
      }
    } catch (err) {
      console.error('Error fetching cattle:', err);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    
    if (!newRecord.cattle_id || !newRecord.amount || !newRecord.milking_date) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/milking/records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecord)
      });

      if (response.ok) {
        setNewRecord({
          cattle_id: '',
          amount: '',
          notes: '',
          session_type: 'morning',
          milking_date: new Date().toISOString().split('T')[0]
        });
        setShowAddModal(false);
        fetchMilkingRecords();
        setError(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add milking record');
      }
    } catch (err) {
      setError('Failed to add milking record: ' + err.message);
      console.error('Error adding milking record:', err);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this milking record?')) {
      return;
    }

    try {
      const response = await fetch(`/api/milking/records/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchMilkingRecords();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete milking record');
      }
    } catch (err) {
      setError('Failed to delete milking record: ' + err.message);
      console.error('Error deleting milking record:', err);
    }
  };

  const filteredRecords = milkingRecords.filter(record => {
    if (filter === 'all') return true;
    if (filter === 'today') {
      const today = new Date().toDateString();
      return new Date(record.milking_date).toDateString() === today;
    }
    if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(record.milking_date) >= weekAgo;
    }
    return true;
  }).filter(record => {
    if (!selectedCattle) return true;
    return record.cattle_id === parseInt(selectedCattle);
  });

  const getTotalMilk = () => {
    return filteredRecords.reduce((total, record) => total + parseFloat(record.amount || 0), 0);
  };

  const getAverageMilk = () => {
    if (filteredRecords.length === 0) return 0;
    return getTotalMilk() / filteredRecords.length;
  };

  const getSessionTypeColor = (sessionType) => {
    switch (sessionType) {
      case 'morning': return 'green';
      case 'afternoon': return 'blue';
      case 'evening': return 'orange';
      default: return 'gray';
    }
  };

  const getSessionTypeDisplayName = (sessionType) => {
    if (!sessionType) return 'Unknown';
    return sessionType.charAt(0).toUpperCase() + sessionType.slice(1);
  };

  const resetForm = () => {
    setNewRecord({
      cattle_id: '',
      amount: '',
      notes: '',
      session_type: 'morning',
      milking_date: new Date().toISOString().split('T')[0]
    });
    setError(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="milking-container">
      <div className="content-header">
        <h1 className="content-title">Milking Records</h1>
        <p className="content-subtitle">Track and manage milk production data</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>📊 Total Milk</h3>
          <p>Total milk production for selected period</p>
          <div className="summary-count">{getTotalMilk().toFixed(2)} L</div>
        </div>
        <div className="dashboard-card">
          <h3>📈 Average Per Session</h3>
          <p>Average milk per milking session</p>
          <div className="summary-count">{getAverageMilk().toFixed(2)} L</div>
        </div>
        <div className="dashboard-card">
          <h3>🐄 Sessions</h3>
          <p>Total milking sessions recorded</p>
          <div className="summary-count">{filteredRecords.length}</div>
        </div>
      </div>

      <div className="content-container">
        <div className="filters-section">
          <div className="form-group">
            <label htmlFor="filter">Time Period</label>
            <select 
              id="filter"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="cattle">Filter by Cattle</label>
            <select 
              id="cattle"
              value={selectedCattle} 
              onChange={(e) => setSelectedCattle(e.target.value)}
            >
              <option value="">All Cattle</option>
              {cattle.map(cow => (
                <option key={cow.cattle_id} value={cow.cattle_id}>
                  {cow.name} ({cow.tag_number})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="records-section">
          <h3>Milking Records</h3>
          {filteredRecords.length === 0 ? (
            <div className="no-records">
              <p>No milking records found for the selected filters.</p>
            </div>
          ) : (
            <div className="milking-table-container">
              <table className="milking-table">
                <thead>
                  <tr>
                    <th>Cattle</th>
                    <th>Tag Number</th>
                    <th>Amount (L)</th>
                    <th>Session Type</th>
                    <th>Date</th>
                    <th>Recorded By</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map(record => (
                    <tr key={record.record_id}>
                      <td>
                        <div className="cattle-info">
                          <div className="cattle-avatar">
                            {record.cattle_name ? record.cattle_name.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div className="cattle-details">
                            <div className="cattle-name">
                              {record.cattle_name || `Cattle #${record.cattle_id}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{record.tag_number || 'N/A'}</td>
                      <td>
                        <span className="amount-value">{record.amount} L</span>
                      </td>
                      <td>
                        <span className={`session-badge ${getSessionTypeColor(record.session_type)}`}>
                          {getSessionTypeDisplayName(record.session_type)}
                        </span>
                      </td>
                      <td>
                        {new Date(record.milking_date).toLocaleDateString()}
                      </td>
                      <td>
                        {record.recorded_by_name || 'Unknown'}
                      </td>
                      <td>
                        <div className="notes-cell">
                          {record.notes ? (
                            <span className="notes-text" title={record.notes}>
                              {record.notes.length > 50 ? record.notes.substring(0, 50) + '...' : record.notes}
                            </span>
                          ) : (
                            <span className="no-notes">No notes</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleDeleteRecord(record.record_id)}
                            className="btn btn-danger btn-sm"
                            title="Delete record"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="add-record-button">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            Add New Milking Record
          </button>
        </div>
      </div>

      {/* Add Milking Record Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Milking Record"
      >
        <form onSubmit={handleAddRecord} className="milking-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cattle_id">Cattle *</label>
              <select
                id="cattle_id"
                value={newRecord.cattle_id}
                onChange={(e) => setNewRecord({...newRecord, cattle_id: e.target.value})}
                required
              >
                <option value="">Select Cattle</option>
                {cattle.map(cow => (
                  <option key={cow.cattle_id} value={cow.cattle_id}>
                    {cow.name} ({cow.tag_number})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="amount">Amount (L) *</label>
              <input
                id="amount"
                type="number"
                step="0.1"
                min="0"
                value={newRecord.amount}
                onChange={(e) => setNewRecord({...newRecord, amount: e.target.value})}
                placeholder="Enter amount in liters"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="session_type">Session Type</label>
              <select
                id="session_type"
                value={newRecord.session_type}
                onChange={(e) => setNewRecord({...newRecord, session_type: e.target.value})}
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="milking_date">Milking Date *</label>
              <input
                id="milking_date"
                type="date"
                value={newRecord.milking_date}
                onChange={(e) => setNewRecord({...newRecord, milking_date: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={newRecord.notes}
              onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
              placeholder="Add any notes about this milking session"
              rows="3"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => {
              setShowAddModal(false);
              resetForm();
            }} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Milking Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Milking; 