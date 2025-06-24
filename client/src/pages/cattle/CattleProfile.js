import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCattle } from '../../api/useCattle';
import { useVet } from '../../api/useVet';
import TabPanel from '../../components/TabPanel';
import Loader from '../../components/Loader';
import '../../styles/Cattle.module.css';

const CattleProfile = () => {
  const { id } = useParams();
  const { getCattleById } = useCattle();
  const { getHealthRecordsByCattle } = useVet();
  const [cattle, setCattle] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = () => {
      const cattleData = getCattleById(id);
      if (cattleData) {
        setCattle(cattleData);
        const records = getHealthRecordsByCattle(id);
        setHealthRecords(records);
      } else {
        setError('Cattle not found');
      }
      setLoading(false);
    };

    fetchData();
  }, [id, getCattleById, getHealthRecordsByCattle]);

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;
  if (!cattle) return <div className="error">Cattle not found</div>;

  const tabs = [
    {
      label: 'General',
      icon: '📋',
      content: (
        <div className="profile-section">
          <div className="profile-header">
            <h3>{cattle.name} ({cattle.id})</h3>
            <div className="profile-actions">
              <Link to={`/cattle/edit/${id}`} className="btn btn-secondary">Edit</Link>
              <Link to={`/cattle/${id}/qr`} className="btn btn-primary">QR Code</Link>
            </div>
          </div>
          
          <div className="profile-info">
            <div className="info-grid">
              <div className="info-item">
                <label>Breed:</label>
                <span>{cattle.breed}</span>
              </div>
              <div className="info-item">
                <label>Age:</label>
                <span>{cattle.age} years</span>
              </div>
              <div className="info-item">
                <label>Health:</label>
                <span className={`health-status ${cattle.health.toLowerCase()}`}>
                  {cattle.health}
                </span>
              </div>
              <div className="info-item">
                <label>Gender:</label>
                <span>{cattle.gender}</span>
              </div>
              <div className="info-item">
                <label>Herd:</label>
                <span>{cattle.location}</span>
              </div>
              <div className="info-item">
                <label>Last Milking:</label>
                <span>{new Date(cattle.lastMilking).toLocaleString()}</span>
              </div>
            </div>
            
            {cattle.notes && (
              <div className="notes-section">
                <h4>Notes</h4>
                <p>{cattle.notes}</p>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      label: 'Medical',
      icon: '🏥',
      content: (
        <div className="profile-section">
          <h3>Medical Records</h3>
          {healthRecords.length === 0 ? (
            <p>No medical records found.</p>
          ) : (
            <div className="records-list">
              {healthRecords.map(record => (
                <div key={record.id} className="record-item">
                  <div className="record-header">
                    <h4>{record.description}</h4>
                    <span className={`status ${record.status}`}>{record.status}</span>
                  </div>
                  <div className="record-details">
                    <p><strong>Type:</strong> {record.type}</p>
                    <p><strong>Date:</strong> {record.date}</p>
                    <p><strong>Veterinarian:</strong> {record.veterinarian}</p>
                    {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      label: 'Breeding',
      icon: '🐄',
      content: (
        <div className="profile-section">
          <h3>Breeding Information</h3>
          <p>Breeding records and information will be displayed here.</p>
          <div className="placeholder-content">
            <p>This section will contain:</p>
            <ul>
              <li>Breeding history</li>
              <li>Pregnancy status</li>
              <li>Calving records</li>
              <li>Genetic information</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      label: 'Feeding',
      icon: '🌾',
      content: (
        <div className="profile-section">
          <h3>Feeding Records</h3>
          <p>Feeding schedule and nutritional information will be displayed here.</p>
          <div className="placeholder-content">
            <p>This section will contain:</p>
            <ul>
              <li>Daily feed intake</li>
              <li>Feed type and composition</li>
              <li>Feeding schedule</li>
              <li>Nutritional requirements</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      label: 'Milking',
      icon: '🥛',
      content: (
        <div className="profile-section">
          <h3>Milking Records</h3>
          <p>Milking production and schedule information will be displayed here.</p>
          <div className="placeholder-content">
            <p>This section will contain:</p>
            <ul>
              <li>Daily milk production</li>
              <li>Milking schedule</li>
              <li>Milk quality data</li>
              <li>Production trends</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      label: 'Financials',
      icon: '💰',
      content: (
        <div className="profile-section">
          <h3>Financial Information</h3>
          <p>Cost and revenue information will be displayed here.</p>
          <div className="placeholder-content">
            <p>This section will contain:</p>
            <ul>
              <li>Purchase cost</li>
              <li>Maintenance expenses</li>
              <li>Revenue from milk/meat</li>
              <li>Profit/loss analysis</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="cattle-profile-container">
      <TabPanel tabs={tabs} />
    </div>
  );
};

export default CattleProfile;
