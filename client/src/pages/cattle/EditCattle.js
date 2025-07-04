import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCattle } from '../../api/useCattle';
import Loader from '../../components/Loader';

const EditCattle = () => {
  const { id } = useParams();
  const { getCattleById, updateCattle } = useCattle();
  const navigate = useNavigate();
  const [cattle, setCattle] = useState(null);
  const [form, setForm] = useState({
    tag_number: '',
    name: '',
    breed: '',
    health: 'Good',
    gender: 'Female',
    date_of_birth: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchCattle = async () => {
      if (dataLoaded) {
        return;
      }
      
      const cattleData = await getCattleById(id);
      
      if (cattleData) {
        setCattle(cattleData);
        
        // Format the date properly for the date input
        let formattedDate = '';
        if (cattleData.date_of_birth) {
          const date = new Date(cattleData.date_of_birth);
          formattedDate = date.toISOString().split('T')[0];
        }
        
        const formData = {
          tag_number: cattleData.tag_number || '',
          name: cattleData.name || '',
          breed: cattleData.breed || '',
          health: cattleData.health || 'Good',
          gender: cattleData.gender || 'Female',
          date_of_birth: formattedDate,
          notes: cattleData.notes || ''
        };
        setForm(formData);
        setDataLoaded(true);
      } else {
        setError('Cattle not found');
      }
      setLoading(false);
    };

    fetchCattle();
  }, [id, getCattleById, dataLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
    <div className="dashboard-container">
      <div className="content-header">
        <h1 className="content-title">Edit Cattle: {cattle.name}</h1>
        <div className="content-actions">
          <button onClick={() => navigate(`/cattle/${id}`)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>

      <div className="content-container">
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Tag Number *</label>
              <input
                type="text"
                name="tag_number"
                value={form.tag_number}
                onChange={handleChange}
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
            <button type="button" onClick={() => navigate(`/cattle/${id}`)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCattle;
