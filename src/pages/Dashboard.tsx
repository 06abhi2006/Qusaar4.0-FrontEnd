import { useAuth } from '../contexts/AuthContext';
import { AdminDashboard } from './admin/AdminDashboard';
import { DoctorDashboard } from './doctor/DoctorDashboard';
import { ReceptionistDashboard } from './receptionist/ReceptionistDashboard';
import { PatientDashboard } from './patient/PatientDashboard';
import { CashierDashboard } from './cashier/CashierDashboard';
import { LabDashboard } from './lab/LabDashboard';
import { RadiologyDashboard } from './radiology/RadiologyDashboard';
import { PharmacyDashboard } from './pharmacy/PharmacyDashboard';
import { InsuranceDashboard } from './insurance/InsuranceDashboard';
import { IPDDashboard } from './ipd/IPDDashboard';

export function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'receptionist':
      return <ReceptionistDashboard />;
    case 'patient':
      return <PatientDashboard />;
    case 'cashier':
      return <CashierDashboard />;
    case 'lab_technician':
      return <LabDashboard />;
    case 'radiologist':
      return <RadiologyDashboard />;
    case 'pharmacist':
      return <PharmacyDashboard />;
    case 'insurance_officer':
      return <InsuranceDashboard />;
    case 'nurse':
      // Nurses have access to multiple modules (IPD, Emergency, OT).
      // Defaulting to IPD Dashboard as a primary workspace.
      return <IPDDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Invalid user role</p>
        </div>
      );
  }
}
