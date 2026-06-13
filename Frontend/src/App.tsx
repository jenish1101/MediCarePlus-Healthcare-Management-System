import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import PatientDashboard from './pages/patient/PatientDashboard';
import FindDoctors from './pages/patient/FindDoctors';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import LabDashboard from './pages/lab/LabDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Patient Routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/doctors"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <FindDoctors />
          </ProtectedRoute>
        }
      />
      <Route path="/patient/*" element={<Navigate to="/patient/dashboard" replace />} />

      {/* Doctor Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/doctor/*" element={<Navigate to="/doctor/dashboard" replace />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Pharmacy Routes */}
      <Route
        path="/pharmacy/dashboard"
        element={
          <ProtectedRoute allowedRoles={['pharmacist']}>
            <PharmacyDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/pharmacy/*" element={<Navigate to="/pharmacy/dashboard" replace />} />

      {/* Lab Routes */}
      <Route
        path="/lab/dashboard"
        element={
          <ProtectedRoute allowedRoles={['lab_tech']}>
            <LabDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/lab/*" element={<Navigate to="/lab/dashboard" replace />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
