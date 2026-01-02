export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient' | 'cashier' | 'nurse' | 'lab_technician' | 'radiologist' | 'pharmacist' | 'insurance_officer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  specialization?: string;
  department?: string;
  patientId?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: string;
  bloodGroup?: string;
  allergies?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  reason: string;
  urgency: 'NORMAL' | 'HIGH';
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  medications: Medication[];
  diagnosis: string;
  notes: string;
  createdAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescriptions: Prescription[];
  vitals?: {
    bloodPressure?: string;
    temperature?: string;
    pulse?: string;
    weight?: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  department: string;
  phone: string;
  available: boolean;
}

export interface HospitalStats {
  totalPatients: number;
  appointmentsToday: number;
  totalDoctors: number;
  totalStaff: number;
}

export interface Department {
  id: string;
  name: string;
  floor: number;
  wing: string;
  description: string;
}

export interface DoctorSearch {
  id: string;
  name: string;
  specialization: string;
  department: string;
  location: string;
  fee: number;
  available: boolean;
  bio: string;
}

export interface HospitalMapFloor {
  floorNumber: number;
  departments: {
    id: string;
    name: string;
    wing: string;
    description: string;
    doctors: {
      id: string;
      name: string;
      cabin: string;
      specialization: string;
      available: boolean;
    }[];
  }[];
}
