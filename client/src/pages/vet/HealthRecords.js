import React, { useState } from 'react';
import { useVet } from '../../api/useVet';
import { useCattle } from '../../api/useCattle';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import '../../styles/Vet.module.css';
import '../../styles/Analytics.module.css';
import { useAuth } from '../../context/AuthContext';

const HealthRecords = () => {
  const { healthRecords, loading, error, addHealthRecord } = useVet();
  const { cattle } = useCattle();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    cattle_id: '',
    treatment: '',
    medical_procedure: '',
    diagnosis: '',
    record_date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await addHealthRecord({ ...form, vet_id: user?.user_id });
    setSubmitting(false);
    if (result.success) {
      setShowModal(false);
      setForm({
        cattle_id: '',
        treatment: '',
        medical_procedure: '',
        diagnosis: '',
        record_date: new Date().toISOString().split('T')[0],
      });
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="health-records-container">
      <div className="page-header">
        <h2>Health Records</h2>
      </div>

      <div className="records-list">
        {healthRecords.length === 0 ? (
          <div className="no-records">
            <p>No health records found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Cattle</th>
                  <th>Medical Procedure</th>
                  <th>Treatment</th>
                  <th>Diagnosis</th>
                  <th>Date</th>
                  <th>Veterinarian</th>
                </tr>
              </thead>
              <tbody>
                {healthRecords.map(record => (
                  <tr key={record.record_id}>
                    <td>{record.cattle_name || record.cattle_id}</td>
                    <td>{record.medical_procedure || '-'}</td>
                    <td>{record.treatment || '-'}</td>
                    <td>{record.diagnosis || '-'}</td>
                    <td>{record.record_date ? record.record_date.split('T')[0] : ''}</td>
                    <td>{record.vet_name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          Add Health Record
        </button>
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
            <select name="cattle_id" value={form.cattle_id} onChange={handleChange} required>
              <option value="">Select Cattle</option>
              {cattle.map(cow => (
                <option key={cow.cattle_id} value={cow.cattle_id}>
                  {cow.name} (ID: {cow.cattle_id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Medical Procedure</label>
            <select
              name="medical_procedure"
              value={form.medical_procedure}
              onChange={handleChange}
              required
            >
              <option value="">Select Procedure</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Deworming">Deworming</option>
              <option value="Insemination">Insemination</option>
              <option value="Surgical">Surgical Procedure</option>
              <option value="Examination">Physical Examination</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Treatment</label>
            <input
              type="text"
              name="treatment"
              value={form.treatment}
              onChange={handleChange}
              placeholder="Treatment details"
            />
          </div>

          <div className="form-group">
            <label>Diagnosis</label>
            <input
              type="text"
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              placeholder="Diagnosis details"
            />
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="record_date"
              value={form.record_date}
              onChange={handleChange}
              required
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
