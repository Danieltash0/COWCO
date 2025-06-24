import React, { useState } from 'react';
import { useVet } from '../../api/useVet';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import '../../styles/Vet.module.css';

const HealthAlerts = () => {
  const { healthAlerts, loading, error, getUpcomingAlerts } = useVet();
  const [filter, setFilter] = useState('all');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const filteredAlerts = filter === 'all' 
    ? healthAlerts 
    : healthAlerts.filter(alert => alert.priority === filter);

  const upcomingAlerts = getUpcomingAlerts();

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="health-alerts-container">
      <div className="page-header">
        <h2>Health Alerts</h2>
        <div className="alert-filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      <div className="alerts-summary">
        <div className="summary-card">
          <h3>Upcoming Alerts</h3>
          <div className="summary-count">{upcomingAlerts.length}</div>
        </div>
        <div className="summary-card">
          <h3>High Priority</h3>
          <div className="summary-count red">
            {healthAlerts.filter(alert => alert.priority === 'high').length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Due This Week</h3>
          <div className="summary-count orange">
            {healthAlerts.filter(alert => {
              const dueDate = new Date(alert.dueDate);
              const today = new Date();
              const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
              return dueDate <= weekFromNow && dueDate >= today;
            }).length}
          </div>
        </div>
      </div>

      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts">
            <p>No health alerts found.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const dueDate = new Date(alert.dueDate);
            const today = new Date();
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

            return (
              <div key={alert.id} className={`alert-card ${isOverdue ? 'overdue' : ''} ${isDueSoon ? 'due-soon' : ''}`}>
                <div className="alert-header">
                  <div className="alert-priority">
                    <span className={`priority-icon ${getPriorityColor(alert.priority)}`}>
                      {getPriorityIcon(alert.priority)}
                    </span>
                    <span className={`priority-text ${getPriorityColor(alert.priority)}`}>
                      {alert.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="alert-status">
                    <span className={`status ${alert.status}`}>{alert.status}</span>
                  </div>
                </div>

                <div className="alert-content">
                  <h3>{alert.description}</h3>
                  <div className="alert-details">
                    <div className="detail-row">
                      <span className="label">Cattle:</span>
                      <Link to={`/cattle/${alert.cattleId}`} className="value link">
                        {alert.cattleName} ({alert.cattleId})
                      </Link>
                    </div>
                    <div className="detail-row">
                      <span className="label">Type:</span>
                      <span className="value">{alert.type}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Due Date:</span>
                      <span className={`value ${isOverdue ? 'overdue' : ''} ${isDueSoon ? 'due-soon' : ''}`}>
                        {alert.dueDate}
                        {isOverdue && <span className="overdue-badge">OVERDUE</span>}
                        {isDueSoon && !isOverdue && <span className="due-soon-badge">DUE SOON</span>}
                      </span>
                    </div>
                    {!isOverdue && (
                      <div className="detail-row">
                        <span className="label">Days Until Due:</span>
                        <span className="value">{daysUntilDue} days</span>
                      </div>
                    )}
                    {isOverdue && (
                      <div className="detail-row">
                        <span className="label">Days Overdue:</span>
                        <span className="value overdue">{Math.abs(daysUntilDue)} days</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="alert-actions">
                  <Link to={`/cattle/${alert.cattleId}`} className="btn btn-secondary">
                    View Cattle
                  </Link>
                  <button className="btn btn-primary">
                    Mark Complete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="alerts-legend">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-icon red">🔴</span>
            <span>High Priority</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon orange">🟡</span>
            <span>Medium Priority</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon green">🟢</span>
            <span>Low Priority</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon overdue">⚠️</span>
            <span>Overdue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAlerts;
