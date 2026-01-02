import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Plus, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Doctor } from '../../types';
import apiClient from '../../lib/api';

export function ManageDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    // Doctor specific
    specialization: '',
    department: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get('/admin/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDoctor(null);
    setFormData({
      name: '', email: '', password: '', phone: '',
      specialization: '', department: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      password: '', // Leave empty to keep unchanged
      phone: doctor.phone,
      specialization: doctor.specialization,
      department: doctor.department,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        // Edit logic (Doctors only for now)
        await apiClient.put(`/admin/doctors/${editingDoctor.id}`, formData);
      } else {
        // Create Logic
        await apiClient.post('/admin/doctors', formData);
      }
      setModalOpen(false);
      fetchDoctors(); // Refresh doctors list
    } catch (error) {
      console.error('Failed to save doctor:', error);
      alert('Failed to save doctor. Please check inputs.');
    }
  };

  const toggleAvailability = async (doctor: Doctor) => {
    try {
      await apiClient.patch(`/admin/doctors/${doctor.id}/availability`, {
        available: !doctor.available,
      });
      fetchDoctors();
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Doctor },
    { header: 'Email', accessor: 'email' as keyof Doctor },
    { header: 'Specialization', accessor: 'specialization' as keyof Doctor },
    { header: 'Department', accessor: 'department' as keyof Doctor },
    { header: 'Phone', accessor: 'phone' as keyof Doctor },
    {
      header: 'Status',
      accessor: (row: Doctor) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {row.available ? 'Available' : 'Unavailable'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: Doctor) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit doctor"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleAvailability(row)}
            className={row.available ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
            title={row.available ? 'Mark unavailable' : 'Mark available'}
          >
            {row.available ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout title="Manage Doctors">
      <Card
        title="Doctors List"
        action={
          <Button onClick={handleAdd} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Doctor
          </Button>
        }
      >
        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <Table data={doctors as any[]} columns={columns as any} emptyMessage="No doctors found" />
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          {/* Password - Required for new, optional for edit */}
          {!editingDoctor && (
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Min. 6 characters"
            />
          )}

          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />

          {/* Conditional Fields: Doctor */}
          <>
            <Input
              label="Specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              required
            />
            <Input
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
          </>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingDoctor ? 'Update' : 'Add'} Doctor
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
