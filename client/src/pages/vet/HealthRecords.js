import React, { useState } from 'react';
import { useVet } from '../../api/useVet';
import { useCattle } from '../../api/useCattle';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import '../../styles/Vet.module.css';

const HealthRecords = () => {
  const { healthRecords, loading, error, addHealthRecord } = useVet();
  const { cattle } = useCattle();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    cattleId: '',
    type: 'checkup',
    description: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const selectedCattle = cattle.find(c => c.id === form.cattleId);
    const recordData = {
      ...form,
      cattleName: selectedCattle?.name || '',
      veterinarian: 'Dr. Sarah Vet', // This would come from auth context
      status: 'completed'
    };

    const result = await addHealthRecord(recordData);
    setSubmitting(false);
    
    if (result.success) {
      setShowModal(false);
      setForm({
        cattleId: '',
        type: 'checkup',
        description: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'orange';
      case 'pending': return 'red';
      default: return 'gray';
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="health-records-container">
      <div className="page-header">
        <h2>Health Records</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          Add Health Record
        </button>
      </div>

      <div className="records-list">
        {healthRecords.length === 0 ? (
          <div className="no-records">
            <p>No health records found.</p>
          </div>
        ) : (
          healthRecords.map(record => (
            <div key={record.id} className="record-card">
              <div className="record-header">
                <h3>{record.description}</h3>
                <span className={`status ${getStatusColor(record.status)}`}>
                  {record.status}
                </span>
              </div>
              <div className="record-details">
                <div className="detail-row">
                  <span className="label">Cattle:</span>
                  <span className="value">{record.cattleName} ({record.cattleId})</span>
                </div>
                <div className="detail-row">
                  <span className="label">Type:</span>
                  <span className="value">{record.type}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{record.date}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Veterinarian:</span>
                  <span className="value">{record.veterinarian}</span>
                </div>
                {record.notes && (
                  <div className="detail-row">
                    <span className="label">Notes:</span>
                    <span className="value">{record.notes}</span>
                  </div>
                )}
                {record.nextDueDate && (
                  <div className="detail-row">
                    <span className="label">Next Due:</span>
                    <span className="value">{record.nextDueDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Health Record"
        size="large"
      >
        <form onSubmit={handleSubmit} className="health-record-form">
          <div className="form-group">
            <label>Cattle *</label>
            <select name="cattleId" value={form.cattleId} onChange={handleChange} required>
              <option value="">Select Cattle</option>
              {cattle.map(cow => (
                <option key={cow.id} value={cow.id}>
                  {cow.name} ({cow.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Type *</label>
            <select name="type" value={form.type} onChange={handleChange} required>
              <option value="checkup">Checkup</option>
              <option value="vaccination">Vaccination</option>
              <option value="treatment">Treatment</option>
              <option value="surgery">Surgery</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of the health record"
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

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional notes about the health record..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HealthRecords;
