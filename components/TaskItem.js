// src/components/TaskItem.jsx
import React from "react";
import "../styles/TaskItem.css";

export default function TaskItem({ task, onToggle }) {
  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <span className={task.completed ? "done" : ""}>{task.description}</span>
    </div>
  );
}
