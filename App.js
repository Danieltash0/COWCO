// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CattleRecords from "./pages/CattleRecords";
import AddCattle from "./pages/AddCattle";
import EditCattle from "./pages/EditCattle";
import CattleProfile from "./pages/CattleProfile";
import QRPage from "./pages/QRPage";
import HealthRecords from "./pages/HealthRecords";
import HealthAlerts from "./pages/HealthAlerts";
import Tasks from "./pages/Tasks";
import Checklist from "./pages/Checklist";
import QRScanner from "./pages/QRScanner";
import QRGenerator from "./pages/QRGenerator";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import IncomeExpenses from "./pages/IncomeExpenses";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/App.css";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/:role" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/cattle-records" element={<ProtectedRoute><CattleRecords /></ProtectedRoute>} />
          <Route path="/cattle/add" element={<ProtectedRoute><AddCattle /></ProtectedRoute>} />
          <Route path="/cattle/edit/:id" element={<ProtectedRoute><EditCattle /></ProtectedRoute>} />
          <Route path="/cattle/:id" element={<ProtectedRoute><CattleProfile /></ProtectedRoute>} />
          <Route path="/cattle/:id/qr" element={<ProtectedRoute><QRPage /></ProtectedRoute>} />
          <Route path="/health-records" element={<ProtectedRoute><HealthRecords /></ProtectedRoute>} />
          <Route path="/health-alerts" element={<ProtectedRoute><HealthAlerts /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/tasks/checklist" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
          <Route path="/qr-scanner" element={<ProtectedRoute><QRScanner /></ProtectedRoute>} />
          <Route path="/qr-generator" element={<ProtectedRoute><QRGenerator /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/income-expenses" element={<ProtectedRoute><IncomeExpenses /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
