import React, { useState } from 'react';
import Modal from '../../components/Modal';
import { useAppointments } from '../../api/useAppointments';
import { useCattle } from '../../api/useCattle';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Analytics.module.css';

const Appointments = () => {
  const { appointments, loading, error, addAppointment } = useAppointments();
  const { cattle } = useCattle();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ cattle_id: '', appointment_date: '', appointment_time: '', reason: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await addAppointment({
      ...form,
      vet_id: user?.user_id
    });
    setSubmitting(false);
    if (result.success) {
      setShowModal(false);
      setForm({ cattle_id: '', appointment_date: '', appointment_time: '', reason: '', notes: '' });
    }
  };

  // Helper to get tomorrow's date in YYYY-MM-DD format
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="appointments-container">
      <div className="page-header">
        <h2>Scheduled Appointments</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          Add Appointment
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <div className="appointments-list">
          {appointments.length === 0 ? (
            <div className="no-appointments">
              <p>No appointments scheduled.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Cattle</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Veterinarian</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appointment => (
                    <tr key={appointment.appointment_id}>
                      <td>{appointment.cattle_name || appointment.cattle_id}</td>
                      <td>{appointment.appointment_date ? appointment.appointment_date.split('T')[0] : ''}</td>
                      <td>{appointment.appointment_time}</td>
                      <td>{appointment.reason || '-'}</td>
                      <td>{appointment.vet_name || '-'}</td>
                      <td>{appointment.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Appointment"
        size="medium"
      >
        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label>Cattle</label>
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
            <label>Date</label>
            <input type="date" name="appointment_date" value={form.appointment_date} onChange={handleChange} required min={getTomorrow()} />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input type="time" name="appointment_time" value={form.appointment_time} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Reason</label>
            <input type="text" name="reason" value={form.reason} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows="2" />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Appointment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments; 