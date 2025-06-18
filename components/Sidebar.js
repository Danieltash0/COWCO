// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const { user } = useAuth();

  const roleLinks = {
    manager: ["/dashboard/manager", "/income-expenses", "/cattle-records", "/reports", "/analytics"],
    vet: ["/dashboard/vet", "/health-records", "/health-alerts"],
    worker: ["/dashboard/worker", "/tasks", "/tasks/checklist"],
    admin: ["/dashboard/admin", "/users", "/logs", "/settings"]
  };

  const commonLinks = ["/qr-scanner", "/qr-generator"];

  return (
    <aside className="sidebar">
      {user && roleLinks[user.role]?.map((link, index) => (
        <Link key={index} to={link}>{link.replace("/", "").replace("-", " ")}</Link>
      ))}
      {user && commonLinks.map((link, index) => (
        <Link key={index} to={link}>{link.replace("/", "").replace("-", " ")}</Link>
      ))}
    </aside>
  );
}
