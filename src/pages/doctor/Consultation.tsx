import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Calendar, Plus, Trash2 } from 'lucide-react';
import { Appointment, Medication } from '../../types';
import apiClient from '../../lib/api';

export function Consultation() {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    temperature: '',
    pulse: '',
    weight: '',
  });
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', frequency: '', duration: '' }
  ]);

  useEffect(() => {
    const appointmentId = window.location.pathname.split('/').pop();
    fetchAppointment(appointmentId || '');
  }, []);

  const fetchAppointment = async (id: string) => {
    try {
      const response = await apiClient.get(`/doctor/appointments/${id}`);
      setAppointment(response.data);
    } catch (error) {
      console.error('Failed to fetch appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiClient.post(`/doctor/consultations`, {
        appointmentId: appointment?.id,
        patientId: appointment?.patientId,
        vitals,
        diagnosis,
        treatment,
        notes,
        medications: medications.filter(m => m.name && m.dosage),
      });

      window.location.href = '/doctor';
    } catch (error) {
      console.error('Failed to save consultation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Consultation">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading consultation...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!appointment) {
    return (
      <Layout title="Consultation">
        <div className="text-center py-12">
          <p className="text-gray-600">Appointment not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Consultation">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Patient Information">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Patient</p>
                <p className="font-medium text-gray-900">{appointment.patientName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Appointment</p>
                <p className="font-medium text-gray-900">{appointment.date} at {appointment.time}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Reason for Visit</p>
            <p className="text-gray-900 mt-1">{appointment.reason}</p>
          </div>
        </Card>

        <Card title="Vital Signs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Blood Pressure"
              placeholder="120/80 mmHg"
              value={vitals.bloodPressure}
              onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
            />
            <Input
              label="Temperature"
              placeholder="98.6°F"
              value={vitals.temperature}
              onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
            />
            <Input
              label="Pulse"
              placeholder="72 bpm"
              value={vitals.pulse}
              onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
            />
            <Input
              label="Weight"
              placeholder="70 kg"
              value={vitals.weight}
              onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
            />
          </div>
        </Card>

        <Card title="Diagnosis & Treatment">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Treatment Plan <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card
          title="Prescription"
          action={
            <Button type="button" size="sm" onClick={addMedication}>
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          }
        >
          <div className="space-y-4">
            {medications.map((med, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Medication Name"
                    value={med.name}
                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    required
                  />
                  <Input
                    label="Dosage"
                    placeholder="500mg"
                    value={med.dosage}
                    onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                    required
                  />
                  <Input
                    label="Frequency"
                    placeholder="Twice daily"
                    value={med.frequency}
                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    required
                  />
                  <Input
                    label="Duration"
                    placeholder="7 days"
                    value={med.duration}
                    onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                    required
                  />
                </div>
                {medications.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeMedication(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.location.href = '/doctor'}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            Complete Consultation
          </Button>
        </div>
      </form>
    </Layout>
  );
}
