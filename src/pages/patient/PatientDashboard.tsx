import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { BookAppointmentModal } from '../../components/patient/BookAppointmentModal';
import { FileText, Calendar, Pill, User, Plus, Map } from 'lucide-react';
import { Appointment, MedicalRecord } from '../../types';
import apiClient from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if user is authenticated
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [appointmentsRes, recordsRes] = await Promise.all([
        apiClient.get('/patient/appointments'),
        apiClient.get('/patient/medical-records'),
      ]);
      setAppointments(appointmentsRes.data);
      setMedicalRecords(recordsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const appointmentColumns = [
    { header: 'Date', accessor: 'date' as keyof Appointment },
    { header: 'Time', accessor: 'time' as keyof Appointment },
    { header: 'Doctor', accessor: 'doctorName' as keyof Appointment },
    { header: 'Reason', accessor: 'reason' as keyof Appointment },
    {
      header: 'Status',
      accessor: (row: Appointment) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          row.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
            row.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
          }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
  ];

  const recordColumns = [
    { header: 'Date', accessor: 'date' as keyof MedicalRecord },
    { header: 'Doctor', accessor: 'doctorName' as keyof MedicalRecord },
    { header: 'Diagnosis', accessor: 'diagnosis' as keyof MedicalRecord },
    {
      header: 'Actions',
      accessor: (row: MedicalRecord) => (
        <button
          onClick={() => setSelectedRecord(row)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout title="Patient Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Patient Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
            {user?.patientId && (
              <p className="text-sm text-gray-500 mt-1">Patient ID: <span className="font-mono font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{user.patientId}</span></p>
            )}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => window.location.href = '/hospital-map'}>
              <Map className="w-4 h-4 mr-2" />
              Hospital Map
            </Button>
            <Button onClick={() => setIsBookModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Medical Records</p>
                <p className="text-2xl font-bold text-gray-900">{medicalRecords.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card title="Appointment History">
          <Table
            data={appointments as any}
            columns={appointmentColumns as any}
            emptyMessage="No appointments found"
          />
        </Card>

        <Card title="Medical Records">
          <Table
            data={medicalRecords as any}
            columns={recordColumns as any}
            emptyMessage="No medical records available"
          />
        </Card>
      </div>

      <Modal
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        title="Medical Record Details"
        size="lg"
      >
        {selectedRecord && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-900">{selectedRecord.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Doctor</p>
                <p className="font-medium text-gray-900">{selectedRecord.doctorName}</p>
              </div>
            </div>

            {selectedRecord.vitals && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Vital Signs</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {selectedRecord.vitals.bloodPressure && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-600">Blood Pressure</p>
                      <p className="font-medium">{selectedRecord.vitals.bloodPressure}</p>
                    </div>
                  )}
                  {selectedRecord.vitals.temperature && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-600">Temperature</p>
                      <p className="font-medium">{selectedRecord.vitals.temperature}</p>
                    </div>
                  )}
                  {selectedRecord.vitals.pulse && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-600">Pulse</p>
                      <p className="font-medium">{selectedRecord.vitals.pulse}</p>
                    </div>
                  )}
                  {selectedRecord.vitals.weight && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-600">Weight</p>
                      <p className="font-medium">{selectedRecord.vitals.weight}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Diagnosis</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRecord.diagnosis}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Treatment Plan</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRecord.treatment}</p>
            </div>

            {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-blue-600" />
                  Prescriptions
                </h4>
                <div className="space-y-3">
                  {selectedRecord.prescriptions.map((prescription, idx) => (
                    <div key={idx} className="bg-blue-50 p-4 rounded-lg">
                      {prescription.medications.map((med, medIdx) => (
                        <div key={medIdx} className="mb-3 last:mb-0">
                          <p className="font-medium text-gray-900">{med.name}</p>
                          <div className="grid grid-cols-3 gap-2 mt-1 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Dosage:</span> {med.dosage}
                            </div>
                            <div>
                              <span className="font-medium">Frequency:</span> {med.frequency}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {med.duration}
                            </div>
                          </div>
                        </div>
                      ))}
                      {prescription.notes && (
                        <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-blue-200">
                          <span className="font-medium">Notes:</span> {prescription.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSuccess={fetchData}
      />
    </Layout>
  );
}
