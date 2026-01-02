import { useState, useEffect, FormEvent } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { UserPlus, Calendar, Users, ClipboardList, Search } from 'lucide-react';
import apiClient from '../../lib/api';

export function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients'>('dashboard');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Register Form State
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'male', phone: '',
    email: '', address: '', bloodGroup: '', allergies: ''
  });

  useEffect(() => {
    if (activeTab === 'patients') {
      fetchPatients();
    }
  }, [activeTab]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/receptionist/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/receptionist/patients', {
        ...formData,
        age: parseInt(formData.age),
      });
      setModalOpen(false);
      fetchPatients();
      alert('Patient registered successfully');
      setFormData({
        name: '', age: '', gender: 'male', phone: '',
        email: '', address: '', bloodGroup: '', allergies: ''
      });
    } catch (error) {
      console.error('Failed to register patient:', error);
      alert('Failed to register patient');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Age', accessor: 'age' },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: 'address' },
  ];

  return (
    <Layout title="Receptionist Dashboard">
      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        <button
          className={`pb-2 px-1 ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Overview
        </button>
        <button
          className={`pb-2 px-1 ${activeTab === 'patients' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('patients')}
        >
          View Patients
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:bg-gray-50"
              onClick={() => setModalOpen(true)}
            >
              <div className="flex items-center space-x-3">
                <UserPlus className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Register Patient</p>
                  <p className="text-xs text-gray-500 mt-1">Quick Add</p>
                </div>
              </div>
            </div>
            {/* Same generic cards for others pointing to existing pages or tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Schedule</p>
                  <p className="text-xs text-gray-500 mt-1">Book appointment</p>
                </div>
              </div>
            </div>
            <div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:bg-gray-50"
              onClick={() => setActiveTab('patients')}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">View Patients</p>
                  <p className="text-xs text-gray-500 mt-1">Patient records</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <ClipboardList className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Appointments</p>
                  <p className="text-xs text-gray-500 mt-1">Manage bookings</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Quick Actions">
              <div className="space-y-3">
                <Button onClick={() => setModalOpen(true)} className="w-full justify-start" variant="secondary">
                  <UserPlus className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Quick Register Patient</p>
                    <p className="text-xs text-gray-600">Register without leaving dashboard</p>
                  </div>
                </Button>
              </div>
            </Card>
            {/* Retain Today's Summary */}
            <Card title="Today's Summary">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">New Registrations</span>
                  <span className="text-2xl font-bold text-blue-600">--</span>
                </div>
                {/* ... other summary items ... */}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'patients' && (
        <Card
          title="All Patients"
          action={
            <Button onClick={() => setModalOpen(true)} size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          }
        >
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table data={patients} columns={columns} emptyMessage="No patients found" />
          )}
        </Card>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register New Patient"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Age" type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                className="w-full border rounded px-3 py-2 text-sm"
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input label="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
          </div>
          <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          <Input label="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Blood Group" value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })} />
            <Input label="Allergies" value={formData.allergies} onChange={e => setFormData({ ...formData, allergies: e.target.value })} />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Register</Button>
          </div>
        </form>
      </Modal>

    </Layout>
  );
}
