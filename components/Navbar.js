// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">CowCo</Link>
      {user && (
        <>
          <span className="welcome">Welcome, {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </>
      )}
    </nav>
  );
}
