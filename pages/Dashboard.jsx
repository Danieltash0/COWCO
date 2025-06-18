// src/pages/Dashboard.jsx
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/pages.css";

export default function Dashboard() {
  const { role } = useParams();
  const { user } = useContext(AuthContext);

  const renderDashboardContent = () => {
    switch (role) {
      case "manager":
        return <div>Welcome Manager {user?.name}, manage farm data and finances here.</div>;
      case "vet":
        return <div>Welcome Veterinarian {user?.name}, access health records and alerts.</div>;
      case "worker":
        return <div>Welcome Worker {user?.name}, view tasks and checklists.</div>;
      case "admin":
        return <div>Welcome Admin {user?.name}, manage users and logs here.</div>;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {renderDashboardContent()}
    </div>
  );
}