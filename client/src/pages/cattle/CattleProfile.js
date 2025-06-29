import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCattle } from '../../api/useCattle';
import Loader from '../../components/Loader';

const CattleProfile = () => {
  const { id } = useParams();
  const { cattle, loading, error } = useCattle();
  const [activeTab, setActiveTab] = useState('profile');

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
        <div className="profile-header">
          <div className="profile-info">
            <h2>{cattleData.name}</h2>
            <p className="cattle-id">ID: {cattleData.cattle_id || cattleData.id}</p>
            <span className={`status ${healthStatus.color}`}>
              {healthStatus.icon} {cattleData.health}
            </span>
          </div>
        </div>

        <div className="tab-container">
          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`tab-button ${activeTab === 'health' ? 'active' : ''}`}
              onClick={() => setActiveTab('health')}
            >
              Health Records
            </button>
            <button
              className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'profile' && (
              <div className="profile-details">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <p>{cattleData.name}</p>
                  </div>
                  <div className="form-group">
                    <label>Breed</label>
                    <p>{cattleData.breed}</p>
                  </div>
                </div>
                <div className="form-row">
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

            {activeTab === 'health' && (
              <div className="health-records">
                <p>Health records will be displayed here.</p>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="cattle-tasks">
                <p>Tasks related to this cattle will be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CattleProfile;
