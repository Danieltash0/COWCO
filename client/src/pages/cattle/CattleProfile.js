import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCattle } from '../../api/useCattle';
import { useVet } from '../../api/useVet';
import Loader from '../../components/Loader';

const CattleProfile = () => {
  const { id } = useParams();
  const { cattle, loading, error } = useCattle();
  const { getHealthRecordsByCattle, healthRecords: vetHealthRecords, loading: vetLoading, error: vetError } = useVet();
  const [view, setView] = useState('general');

  const cattleData = cattle.find(cow => (cow.cattle_id || cow.id) === parseInt(id));

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;
  if (!cattleData) return <div className="error">Cattle not found</div>;

  const getHealthStatus = (health) => {
    switch (health) {
      case 'Excellent':
        return { color: 'green', icon: '🟢' };
      case 'Good':
        return { color: 'blue', icon: '🔵' };
      case 'Fair':
        return { color: 'orange', icon: '🟡' };
      case 'Poor':
        return { color: 'red', icon: '🔴' };
      default:
        return { color: 'gray', icon: '⚪' };
    }
  };

  const healthStatus = getHealthStatus(cattleData.health);
  const healthRecords = getHealthRecordsByCattle(cattleData.cattle_id || cattleData.id);

  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h1 className="content-title">Cattle Profile</h1>
        <div className="content-actions">
          <Link to="/cattle" className="btn btn-secondary">
            Back to List
          </Link>
          <Link to={`/cattle/${id}/edit`} className="btn btn-primary">
            Edit Cattle
          </Link>
        </div>
      </div>

      <div className="content-container">
        <div style={{ marginBottom: 24 }}>
          <button
            className={`btn btn-tab${view === 'general' ? ' btn-primary' : ''}`}
            onClick={() => setView('general')}
            style={{ marginRight: 8 }}
          >
            General Details
          </button>
          <button
            className={`btn btn-tab${view === 'health' ? ' btn-primary' : ''}`}
            onClick={() => setView('health')}
          >
            Health Details
          </button>
        </div>

        {view === 'general' && (
          <div className="profile-header">
            <div className="profile-info">
              <h2>{cattleData.name}</h2>
              <p className="cattle-id">ID: {cattleData.cattle_id || cattleData.id}</p>
              <span className={`status ${healthStatus.color}`}>
                {healthStatus.icon} {cattleData.health}
              </span>
            </div>
          </div>
        )}

        {view === 'general' && (
          <div className="profile-details">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <p>{cattleData.name}</p>
              </div>
              <div className="form-group">
                <label>Cow Tag</label>
                <p>{cattleData.tag_number || 'Not assigned'}</p>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Breed</label>
                <p>{cattleData.breed}</p>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <p>{cattleData.date_of_birth ? new Date(cattleData.date_of_birth).toLocaleDateString() : 'Not specified'}</p>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Health Status</label>
                <p>{cattleData.health}</p>
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <p>{cattleData.notes}</p>
            </div>
          </div>
        )}

        {view === 'health' && (
          <div className="profile-health-details">
            <h3>Medical Records</h3>
            {vetLoading ? (
              <Loader />
            ) : vetError ? (
              <div className="error">Error: {vetError}</div>
            ) : healthRecords.length === 0 ? (
              <p>No medical records found for this cattle.</p>
            ) : (
              <table className="health-records-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Treatment</th>
                    <th>Procedure</th>
                    <th>Diagnosis</th>
                  </tr>
                </thead>
                <tbody>
                  {healthRecords.map(record => (
                    <tr key={record.record_id}>
                      <td>{record.record_date ? new Date(record.record_date).toLocaleDateString() : ''}</td>
                      <td>{record.treatment || '-'}</td>
                      <td>{record.medical_procedure || '-'}</td>
                      <td>{record.diagnosis || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CattleProfile;
