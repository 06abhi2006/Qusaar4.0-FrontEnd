import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { ManageDoctors } from './pages/admin/ManageDoctors';
import { ManageReceptionists } from './pages/admin/ManageReceptionists';
import { ManageCashiers } from './pages/admin/ManageCashiers';
import { Consultation } from './pages/doctor/Consultation';
import { RegisterPatient } from './pages/receptionist/RegisterPatient';
import { ScheduleAppointment } from './pages/receptionist/ScheduleAppointment';
import { CashierDashboard } from './pages/cashier/CashierDashboard';
import { HospitalMap } from './pages/HospitalMap';
import { IPDDashboard } from './pages/ipd/IPDDashboard';
import { EmergencyDashboard } from './pages/emergency/EmergencyDashboard';
import { OTDashboard } from './pages/ot/OTDashboard';
import { PharmacyDashboard } from './pages/pharmacy/PharmacyDashboard';
import { LabDashboard } from './pages/lab/LabDashboard';
import { RadiologyDashboard } from './pages/radiology/RadiologyDashboard';
import { InsuranceDashboard } from './pages/insurance/InsuranceDashboard';

export function Router() {
  const { user, loading } = useAuth();
  const [path, setPath] = useState(window.location.pathname);

  // Listen for navigation events (popstate for browser back/forward, custom events for programmatic navigation)
  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    // Also listen to initial path
    setPath(window.location.pathname);

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    // Only redirect if:
    // 1. Auth context has finished loading
    // 2. No user is authenticated
    // 3. Not already on login page
    // 4. Not in the middle of a navigation
    if (!loading && !user && path !== '/login' && path !== '/signup' && !path.includes('?session_expired')) {
      // Use replaceState instead of window.location.href to avoid full page reload
      window.history.replaceState(null, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [user, loading, path]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (path === '/login') {
    return <Login />;
  }

  if (path === '/signup') {
    return <Signup />;
  }

  if (path === '/' || path === '') {
    return (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    );
  }

  if (path === '/admin/doctors') {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <ManageDoctors />
      </ProtectedRoute>
    );
  }

  if (path === '/admin/receptionists') {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <ManageReceptionists />
      </ProtectedRoute>
    );
  }

  if (path === '/admin/cashiers') {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <ManageCashiers />
      </ProtectedRoute>
    );
  }

  if (path.startsWith('/doctor/consultation/')) {
    return (
      <ProtectedRoute allowedRoles={['doctor']}>
        <Consultation />
      </ProtectedRoute>
    );
  }

  if (path === '/receptionist/register-patient') {
    return (
      <ProtectedRoute allowedRoles={['receptionist']}>
        <RegisterPatient />
      </ProtectedRoute>
    );
  }

  if (path === '/receptionist/schedule') {
    return (
      <ProtectedRoute allowedRoles={['receptionist']}>
        <ScheduleAppointment />
      </ProtectedRoute>
    );
  }

  if (path === '/cashier') {
    return (
      <ProtectedRoute allowedRoles={['cashier']}>
        <CashierDashboard />
      </ProtectedRoute>
    );
  }

  if (path === '/hospital-map') {
    return (
      <ProtectedRoute>
        <HospitalMap />
      </ProtectedRoute>
    );
  }

  if (path === '/ipd') {
    return (
      <ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse']}>
        <IPDDashboard />
      </ProtectedRoute>
    );
  }

  if (path === '/emergency') {
    return (
      <ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist']}>
        <EmergencyDashboard />
      </ProtectedRoute>
    );
  }

  if (path === '/ot') {
    return (
      <ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse']}>
        <OTDashboard />
      </ProtectedRoute>
    );
  }

  if (path === '/pharmacy') {
    return (
      <ProtectedRoute allowedRoles={['admin', 'pharmacist', 'doctor']}>
        <PharmacyDashboard />
      </ProtectedRoute>
    );
  }

  if (path === '/lab') {
    return (
      <ProtectedRoute allowedRoles={['admin', 'lab_technician', 'doctor']}>
        <LabDashboard />
      </ProtectedRoute>
    );
  }

  if (path === '/radiology') {
    return (
      <ProtectedRoute allowedRoles={['admin', 'radiologist', 'doctor']}>
        <RadiologyDashboard />
      </ProtectedRoute>
    );
  }

  if (path === '/insurance') {
    return (
      <ProtectedRoute allowedRoles={['admin', 'insurance_officer']}>
        <InsuranceDashboard />
      </ProtectedRoute>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Page not found</p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
