import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
// import ForgotPassword from './pages/auth/ForgotPassword';
import Unauthorized from './pages/auth/Unauthorized';

// Dashboard Pages
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import VetDashboard from './pages/dashboard/VetDashboard';
import WorkerDashboard from './pages/dashboard/WorkerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Cattle Pages
import CattleList from './pages/cattle/CattleList';
import AddCattle from './pages/cattle/AddCattle';
import EditCattle from './pages/cattle/EditCattle';
import CattleProfile from './pages/cattle/CattleProfile';
import CattleQR from './pages/cattle/CattleQR';

// Vet Pages
import HealthRecords from './pages/vet/HealthRecords';
import HealthAlerts from './pages/vet/HealthAlerts';

// Task Pages
import Tasks from './pages/tasks/Tasks';
import AddTask from './pages/tasks/AddTask';
import Checklist from './pages/tasks/Checklist';

// Milking Pages
import Milking from './pages/milking/Milking';

// Report Pages
import Reports from './pages/reports/Reports';
import Analytics from './pages/reports/Analytics';

// QR Pages
import QRGenerator from './pages/qr/QRGenerator';
import QRScanner from './pages/qr/QRScanner';

// Admin Pages
import Users from './pages/admin/Users';
import Logs from './pages/admin/Logs';
import Settings from './pages/admin/Settings';

import './styles/App.css';

function App() {
  const { user } = useAuth();

  const getDashboardByRole = (role) => {
    switch (role) {
      case 'Farm Manager':
        return '/dashboard/manager';
      case 'Veterinarian':
        return '/dashboard/vet';
      case 'Worker':
        return '/dashboard/worker';
      case 'Admin':
        return '/dashboard/admin';
      default:
        return '/dashboard/manager';
    }
  };

  return (
    <Router>
      <div className="app">
        {user && <Navbar />}
        <main className="page-container">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={user ? <Navigate to={getDashboardByRole(user.role)} /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to={getDashboardByRole(user.role)} /> : <Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard/manager" element={
              <ProtectedRoute allowedRoles={['Farm Manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/vet" element={
              <ProtectedRoute allowedRoles={['Veterinarian']}>
                <VetDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/worker" element={
              <ProtectedRoute allowedRoles={['Worker']}>
                <WorkerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Cattle Routes */}
            <Route path="/cattle" element={
              <ProtectedRoute allowedRoles={['Farm Manager', 'Veterinarian', 'Worker', 'Admin']}>
                <CattleList />
              </ProtectedRoute>
            } />
            <Route path="/cattle/add" element={
              <ProtectedRoute allowedRoles={['Farm Manager', 'Admin']}>
                <AddCattle />
              </ProtectedRoute>
            } />
            <Route path="/cattle/:id/edit" element={
              <ProtectedRoute allowedRoles={['Farm Manager', 'Admin']}>
                <EditCattle />
              </ProtectedRoute>
            } />
            <Route path="/cattle/:id" element={
              <ProtectedRoute allowedRoles={['Farm Manager', 'Veterinarian', 'Worker', 'Admin']}>
                <CattleProfile />
              </ProtectedRoute>
            } />
            <Route path="/cattle/:id/qr" element={
              <ProtectedRoute allowedRoles={['Farm Manager', 'Veterinarian', 'Worker', 'Admin']}>
                <CattleQR />
              </ProtectedRoute>
            } />

            {/* Vet Routes */}
            <Route path="/health-records" element={
              <ProtectedRoute allowedRoles={['Veterinarian', 'Admin']}>
                <HealthRecords />
              </ProtectedRoute>
            } />
            <Route path="/health-alerts" element={
              <ProtectedRoute allowedRoles={['Veterinarian', 'Admin']}>
                <HealthAlerts />
              </ProtectedRoute>
            } />

            {/* Task Routes */}
            <Route path="/tasks" element={
              <ProtectedRoute allowedRoles={['Farm Manager', 'Worker', 'Admin']}>
                <Tasks />
              </ProtectedRoute>
            } />
            <Route path="/tasks/add" element={
              <ProtectedRoute allowedRoles={['Farm Manager']}>
                <AddTask />
              </ProtectedRoute>
            } />
            <Route path="/tasks/checklist" element={
              <ProtectedRoute allowedRoles={['Worker']}>
                <Checklist />
              </ProtectedRoute>
            } />

            {/* Milking Routes */}
            <Route path="/milking" element={
              <ProtectedRoute allowedRoles={['Worker']}>
                <Milking />
              </ProtectedRoute>
            } />

            {/* Report Routes */}
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['Farm Manager', 'Admin']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute allowedRoles={['Farm Manager', 'Admin']}>
                <Analytics />
              </ProtectedRoute>
            } />

            {/* QR Routes */}
            <Route path="/qr-generator" element={
              <ProtectedRoute allowedRoles={['Farm Manager', 'Admin']}>
                <QRGenerator />
              </ProtectedRoute>
            } />
            <Route path="/qr-scanner" element={
              <ProtectedRoute allowedRoles={['Farm Manager', 'Veterinarian', 'Worker', 'Admin']}>
                <QRScanner />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/logs" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Logs />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Settings />
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={
              user ? <Navigate to={getDashboardByRole(user.role)} /> : <Navigate to="/login" />
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
