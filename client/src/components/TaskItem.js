import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Tasks.module.css';

const TaskItem = ({ task, onStatusChange, onDelete, onEdit }) => {
  const {
    id,
    title,
    description,
    priority,
    status,
    assignee,
    dueDate,
    category,
    completed
  } = task;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return styles.high;
      case 'medium':
        return styles.medium;
      case 'low':
        return styles.low;
      default:
        return styles.medium;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return styles.pending;
      case 'in-progress':
        return styles['in-progress'];
      case 'completed':
        return styles.completed;
      case 'overdue':
        return styles.overdue;
      default:
        return styles.pending;
    }
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = () => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  return (
    <div className={`${styles.taskCard} ${completed ? styles.completed : ''} ${isOverdue() ? styles.overdue : ''}`}>
      <div className={styles.taskStatus}>
        <span className={`${styles.statusBadge} ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      <div className={styles.taskHeader}>
        <h3 className={styles.taskTitle}>{title}</h3>
        <span className={`${styles.taskPriority} ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      </div>

      {description && (
        <p className={styles.taskDescription}>{description}</p>
      )}

      <div className={styles.taskMeta}>
        <div className={styles.taskMetaItem}>
          <span className={styles.taskMetaIcon}>📅</span>
          Due: {formatDate(dueDate)}
        </div>
        {category && (
          <div className={styles.taskMetaItem}>
            <span className={styles.taskMetaIcon}>🏷️</span>
            {category}
          </div>
        )}
      </div>

      {assignee && (
        <div className={styles.taskAssignee}>
          <div className={styles.taskAssigneeAvatar}>
            {assignee.name.charAt(0).toUpperCase()}
          </div>
          <span className={styles.taskAssigneeName}>{assignee.name}</span>
        </div>
      )}

      <div className={styles.taskActions}>
        {status !== 'completed' && (
          <button
            className="btn btn-success"
            onClick={() => handleStatusChange('completed')}
          >
            Complete
          </button>
        )}
        
        {status === 'pending' && (
          <button
            className="btn btn-primary"
            onClick={() => handleStatusChange('in-progress')}
          >
            Start
          </button>
        )}

        <button
          className="btn btn-outline"
          onClick={handleEdit}
        >
          Edit
        </button>

        <button
          className="btn btn-danger"
          onClick={handleDelete}
        >
          Delete
        </button>

        <Link
          to={`/tasks/${id}`}
          className="btn btn-secondary"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TaskItem;
