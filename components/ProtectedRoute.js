// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}


// src/components/CattleCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/CattleCard.css";

export default function CattleCard({ cow }) {
  return (
    <div className="cattle-card">
      <h3>{cow.name}</h3>
      <p>ID: {cow.id}</p>
      <p>Breed: {cow.breed}</p>
      <p>Age: {cow.age}</p>
      <Link to={`/cattle/${cow.id}`}>View Details</Link>
    </div>
  );
}
