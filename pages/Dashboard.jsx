// src/pages/Dashboard.jsx
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/pages.css";

export default function Dashboard() {
  const { role } = useParams();
  const { user } = useContext(AuthContext);

  // Appointment form state
  const [appointment, setAppointment] = useState({
    cattleId: "",
    appointmentDate: "",
    veterinarian: "",
    symptoms: "",
  });
  const [appointments, setAppointments] = useState([]);
  const [formMessage, setFormMessage] = useState("");

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    const { cattleId, appointmentDate, veterinarian } = appointment;
    if (cattleId && appointmentDate && veterinarian) {
      setAppointments([
        ...appointments,
        { ...appointment, id: Date.now() }
      ]);
      setAppointment({
        cattleId: "",
        appointmentDate: "",
        veterinarian: "",
        symptoms: "",
      });
      setFormMessage("Appointment scheduled successfully!");
      setTimeout(() => setFormMessage(""), 2000);
    } else {
      setFormMessage("Please fill in all required fields.");
      setTimeout(() => setFormMessage(""), 2000);
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="app-title">CowCo Webapp</h1>
        <div className="welcome-logout">
          <span className="welcome">
            Welcome, <span id="username">{user?.name || "User"}</span>!
          </span>
          {/* You can implement logout logic here */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", margin: "1rem 0" }}>
        <div className="stats-card">
          <div className="stats-icon">👤</div>
          <h3 className="stats-title">Total Cattle</h3>
          <p className="stats-value">120</p>
          <p className="stats-subtext">+5 this month</p>
        </div>
        <div className="stats-card">
          <div className="stats-icon">✅</div>
          <h3 className="stats-title">Healthy Cattle</h3>
          <p className="stats-value">110</p>
          <p className="stats-subtext">91% of herd</p>
        </div>
        <div className="stats-card">
          <div className="stats-icon">⚠️</div>
          <h3 className="stats-title">Sick Cattle</h3>
          <p className="stats-value">10</p>
          <p className="stats-subtext">2 new cases</p>
        </div>
        <div className="stats-card">
          <div className="stats-icon">💰</div>
          <h3 className="stats-title">Monthly Income</h3>
          <p className="stats-value">$12,500</p>
          <p className="stats-subtext">+15% from last month</p>
        </div>
        <div className="stats-card">
          <div className="stats-icon">💸</div>
          <h3 className="stats-title">Monthly Expenses</h3>
          <p className="stats-value">$3,200</p>
          <p className="stats-subtext">-5% from last month</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Schedule Appointment */}
        <div className="section appointment-section">
          <h2 className="section-title">Schedule Health Appointment</h2>
          <p className="section-description">Fill in the details to schedule an appointment.</p>
          <form className="appointment-form" onSubmit={handleAppointmentSubmit}>
            <div className="form-group">
              <label className="form-label">Cattle ID/Tag</label>
              <input
                type="text"
                name="cattleId"
                className="form-input"
                placeholder="e.g., C123"
                value={appointment.cattleId}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Appointment Date</label>
              <input
                type="date"
                name="appointmentDate"
                className="form-input"
                value={appointment.appointmentDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Veterinarian</label>
              <input
                type="text"
                name="veterinarian"
                className="form-input"
                placeholder="e.g., Dr. Smith"
                value={appointment.veterinarian}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Symptoms Observed</label>
              <textarea
                name="symptoms"
                className="form-input"
                placeholder="e.g., Fever, Lameness"
                value={appointment.symptoms}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="submit-btn">Schedule</button>
            {formMessage && <div style={{ marginTop: "0.5rem", color: "#007b00" }}>{formMessage}</div>}
          </form>
        </div>

        {/* Upcoming Appointments */}
        <div className="section upcoming-section">
          <h2 className="section-title">Upcoming Health Appointments</h2>
          <p className="section-description">A list of scheduled health checks for your cattle.</p>
          {appointments.length === 0 ? (
            <p className="appointments-status">No upcoming appointments.</p>
          ) : (
            <ul>
              {appointments.map((a) => (
                <li key={a.id}>
                  <strong>{a.cattleId}</strong> - {a.appointmentDate} with {a.veterinarian}
                  {a.symptoms && <> ({a.symptoms})</>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cattle Feed Inventory */}
        <div className="section inventory-section">
          <h2 className="section-title">Cattle Feed Inventory</h2>
          <p className="section-description">Check and manage your feed stock.</p>
          <div className="inventory-grid" style={{ display: "flex", gap: "1rem" }}>
            <div className="inventory-item">
              <p className="item-label">Feed Type</p>
              <p className="item-value">Alfalfa Hay</p>
            </div>
            <div className="inventory-item">
              <p className="item-label">Quantity</p>
              <p className="item-value">500 lbs</p>
            </div>
            <div className="inventory-item">
              <p className="item-label">Last Updated</p>
              <p className="item-value">2023-06-15</p>
            </div>
          </div>
        </div>

        {/* Vaccination Schedule */}
        <div className="section vaccination-section">
          <h2 className="section-title">Vaccination Schedule</h2>
          <p className="section-description">Upcoming vaccination dates for your herd.</p>
          <div className="vaccination-grid" style={{ display: "flex", gap: "1rem" }}>
            <div className="vaccination-item">
              <p className="item-label">Next Vaccination</p>
              <p className="item-value">2023-06-20</p>
            </div>
            <div className="vaccination-item">
              <p className="item-label">Cattle Due</p>
              <p className="item-value">30 cattle</p>
            </div>
            <div className="vaccination-item">
              <p className="item-label">Vaccine Type</p>
              <p className="item-value">IBR-BVD</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }