import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCattle } from '../../api/useCattle';
import Loader from '../../components/Loader';
import '../../styles/Cattle.module.css';

const EditCattle = () => {
  const { id } = useParams();
  const { getCattleById, updateCattle } = useCattle();
  const navigate = useNavigate();
  const [cattle, setCattle] = useState(null);
  const [form, setForm] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    health: 'Good',
    location: '',
    gender: 'Female',
    dateOfBirth: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCattle = () => {
      const cattleData = getCattleById(id);
      if (cattleData) {
        setCattle(cattleData);
        setForm({
          name: cattleData.name || '',
          breed: cattleData.breed || '',
          age: cattleData.age || '',
          weight: cattleData.weight || '',
          health: cattleData.health || 'Good',
          location: cattleData.location || '',
          gender: cattleData.gender || 'Female',
          dateOfBirth: cattleData.dateOfBirth || '',
          notes: cattleData.notes || ''
        });
      } else {
        setError('Cattle not found');
      }
      setLoading(false);
    };

    fetchCattle();
  }, [id, getCattleById]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const result = await updateCattle(id, form);
    setSaving(false);

    if (result.success) {
      navigate(`/cattle/${id}`);
    } else {
      setError(result.error || 'Failed to update cattle');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;
  if (!cattle) return <div className="error">Cattle not found</div>;

  return (
    <div className="cattle-form-container">
      <h2>Edit Cattle: {cattle.name}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="cattle-form">
        <div className="form-row">
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
          <div className="form-group">
            <label>Breed *</label>
            <select name="breed" value={form.breed} onChange={handleChange} required>
              <option value="">Select Breed</option>
              <option value="Holstein">Holstein</option>
              <option value="Jersey">Jersey</option>
              <option value="Angus">Angus</option>
              <option value="Hereford">Hereford</option>
              <option value="Brahman">Brahman</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age (years) *</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              min="0"
              max="20"
              required
            />
          </div>
          <div className="form-group">
            <label>Weight (kg) *</label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Health Status *</label>
            <select name="health" value={form.health} onChange={handleChange} required>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Gender *</label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g., Barn A - Stall 1"
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
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
          <button type="button" onClick={() => navigate(`/cattle/${id}`)} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCattle;
