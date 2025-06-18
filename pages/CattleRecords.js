// src/pages/CattleRecords.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages.css";

export default function CattleRecords() {
  // Dummy cattle data
  const cattle = [
    { id: 1, name: "Bessie" },
    { id: 2, name: "Duke" }
  ];

  return (
    <div className="cattle-records">
      <h2>Cattle Records</h2>
      <Link to="/cattle/add">Add New Cattle</Link>
      <ul>
        {cattle.map(cow => (
          <li key={cow.id}>
            <Link to={`/cattle/${cow.id}`}>{cow.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
