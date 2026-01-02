import { useEffect, useState, FormEvent } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Calendar, Clock, User, Plus, FileText, Download } from 'lucide-react';
import { Appointment } from '../../types';
import apiClient from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export function DoctorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'patients'>('overview');

  // Dashboard State
  const [appointments, setAppointments] = useState<any[]>([]);

  // Patients State
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null); // For adding record
  const [recordModalOpen, setRecordModalOpen] = useState(false);

  // Loading State
  const [loading, setLoading] = useState(true);

  // Form State
  const [recordForm, setRecordForm] = useState({
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      if (activeTab === 'overview') {
        fetchTodayAppointments();
      } else if (activeTab === 'patients') {
        fetchPatients();
      }
    } else {
      setLoading(false);
    }
  }, [user, activeTab]);

  const fetchTodayAppointments = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/doctor/appointments/today');
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/doctor/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = (appointmentId: string) => {
    window.location.href = `/doctor/consultation/${appointmentId}`;
  };

  const handleDownloadPDF = async (medicalRecordId: string) => {
    try {
      const response = await apiClient.get(`/doctor/consultations/${medicalRecordId}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${medicalRecordId}.pdf`); // Filename usually ignored if Header set, but good fallback
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download PDF');
    }
  };

  const handleAddRecord = (patient: any) => {
    setSelectedPatient(patient);
    setRecordForm({ diagnosis: '', treatment: '', prescription: '', notes: '' });
    setRecordModalOpen(true);
  };

  const handleRecordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedPatient) return;
      await apiClient.post('/doctor/consultations', {
        patientId: selectedPatient.id,
        ...recordForm
      });
      alert('Medical record added successfully');
      setRecordModalOpen(false);
    } catch (error) {
      console.error('Failed to add record:', error);
      alert('Failed to add medical record');
    }
  };

  const appointmentColumns = [
    {
      header: 'Time',
      accessor: (row: any) => (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{row.time}</span>
        </div>
      ),
    },
    {
      header: 'Patient',
      accessor: (row: any) => (
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{row.patientName}</span>
          </div>
          {row.patientId && <span className="text-xs text-gray-500 ml-6">{row.patientId}</span>}
        </div>
      ),
    },
    { header: 'Reason', accessor: 'reason' },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          row.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
            row.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
          }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex space-x-2">
          {(row.status === 'CONFIRMED' || row.status === 'PENDING') && (
            <Button size="sm" onClick={() => handleStartConsultation(row.id)}>Start</Button>
          )}
          {row.status === 'COMPLETED' && row.medicalRecordId && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleDownloadPDF(row.medicalRecordId)}
              title="Download Prescription"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const patientColumns = [
    { header: 'Patient ID', accessor: 'patientId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Age', accessor: 'age' },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <Button size="sm" variant="secondary" onClick={() => handleAddRecord(row)}>
          <FileText className="w-4 h-4 mr-2" />
          Add Record
        </Button>
      ),
    },
  ];

  return (
    <Layout title="Doctor Dashboard">
      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        <button
          className={`pb-2 px-1 ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`pb-2 px-1 ${activeTab === 'patients' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('patients')}
        >
          My Patients
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                </div>
              </div>
            </div>
            {/* ... other stats ... */}
          </div>

          <Card title="Today's Schedule">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <Table
                data={appointments as any[]}
                columns={appointmentColumns as any}
                emptyMessage="No appointments scheduled for today"
              />
            )}
          </Card>
        </div>
      )}

      {activeTab === 'patients' && (
        <Card title="Patient List">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table data={patients as any[]} columns={patientColumns as any} emptyMessage="No patients found" />
          )}
        </Card>
      )}

      <Modal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        title={`Add Medical Record - ${selectedPatient?.name}`}
      >
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <Input label="Diagnosis" value={recordForm.diagnosis} onChange={e => setRecordForm({ ...recordForm, diagnosis: e.target.value })} required />
          <Input label="Treatment" value={recordForm.treatment} onChange={e => setRecordForm({ ...recordForm, treatment: e.target.value })} required />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prescription</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={recordForm.prescription}
              onChange={e => setRecordForm({ ...recordForm, prescription: e.target.value })}
              placeholder="Enter prescription details..."
            />
          </div>

          <Input label="Notes" value={recordForm.notes} onChange={e => setRecordForm({ ...recordForm, notes: e.target.value })} />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setRecordModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Record</Button>
          </div>
        </form>
      </Modal>

    </Layout>
  );
}
