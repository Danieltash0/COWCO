import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCattle } from '../../api/useCattle';
import { useAdmin } from '../../api/useAdmin';
import Modal from '../../components/Modal';

const Appointments = () => {
  const { user } = useAuth();
  const { cattle } = useCattle();
  const { users } = useAdmin();
  
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    cattle_id: '',
    appointment_date: '',
    reason: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vet/appointments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/vet/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...form,
          vet_id: user.user_id
        })
      });
      
      if (response.ok) {
        setShowModal(false);
        setForm({
          cattle_id: '',
          appointment_date: '',
          reason: ''
        });
        fetchAppointments();
      } else {
        alert('Failed to create appointment');
      }
    } catch (error) {
      alert('Error creating appointment: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const femaleCattle = cattle.filter(c => c.gender === 'Female');

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>Health Appointments</h1>
        <button 
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Schedule Appointment
        </button>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No appointments scheduled
          </div>
        ) : (
          appointments.map(appointment => {
            const cattleInfo = cattle.find(c => c.cattle_id === appointment.cattle_id);
            const vetInfo = users.find(u => u.id === appointment.vet_id);
            
            return (
              <div 
                key={appointment.appointment_id}
                style={{
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                      {cattleInfo?.name || 'Unknown Cattle'} ({cattleInfo?.tag_number})
                    </h3>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString()}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Veterinarian:</strong> {vetInfo?.name || 'Unknown'}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Status:</strong> 
                      <span style={{ 
                        color: appointment.status === 'completed' ? '#28a745' : 
                               appointment.status === 'cancelled' ? '#dc3545' : '#ffc107',
                        fontWeight: 'bold',
                        marginLeft: '5px'
                      }}>
                        {appointment.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Schedule New Appointment"
        size="medium"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Select Cattle *
            </label>
            <select
              name="cattle_id"
              value={form.cattle_id}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              <option value="">Choose a cattle</option>
              {femaleCattle.map(c => (
                <option key={c.cattle_id} value={c.cattle_id}>
                  {c.name} ({c.tag_number}) - {c.breed}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Appointment Date *
            </label>
            <input
              type="date"
              name="appointment_date"
              value={form.appointment_date}
              onChange={handleChange}
              min={getTomorrowDate()}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Reason for Appointment *
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Describe the reason for this appointment..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#28a745',
                color: 'white',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments; 