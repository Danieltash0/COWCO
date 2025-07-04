import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCattle } from '../../api/useCattle';
import '../../styles/Cattle.module.css';

const AddCattle = () => {
  const { addCattle } = useCattle();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tag_number: '',
    name: '',
    breed: '',
    health: 'Good',
    gender: 'Female',
    date_of_birth: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await addCattle(form);
    setLoading(false);

    if (result.success) {
      navigate('/cattle');
    } else {
      setError(result.error || 'Failed to add cattle');
    }
  };

  return (
    <div className="cattle-form-container">
      <h2>Add New Cattle</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="cattle-form">
        <div className="form-row">
          <div className="form-group">
            <label>Tag Number *</label>
            <input
              type="text"
              name="tag_number"
              value={form.tag_number}
              onChange={handleChange}
              placeholder="e.g., CT001"
              required
            />
          </div>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Breed *</label>
            <select name="breed" value={form.breed} onChange={handleChange} required>
              <option value="">Select Breed</option>
              <option value="Fresian">Fresian</option>
              <option value="Holstein">Holstein</option>
              <option value="Jersey">Jersey</option>
              <option value="Brown Swiss">Brown Swiss</option>
              <option value="Angus">Angus</option>
              <option value="Hereford">Hereford</option>
              <option value="Galloway">Galloway</option>
              <option value="Brahman">Brahman</option>
            </select>
          </div>
          <div className="form-group">
            <label>Health Status *</label>
            <select name="health" value={form.health} onChange={handleChange} required>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Gender *</label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Additional notes about the cattle..."
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/cattle')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Cattle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCattle;
