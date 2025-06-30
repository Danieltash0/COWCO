import Appointments from './pages/vet/Appointments';

<Route path="/appointments" element={<ProtectedRoute allowedRoles={['vet', 'admin', 'manager']}><Appointments /></ProtectedRoute>} />
