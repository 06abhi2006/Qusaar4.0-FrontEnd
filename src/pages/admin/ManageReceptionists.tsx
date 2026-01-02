import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2 } from 'lucide-react';
import apiClient from '../../lib/api';

interface Receptionist {
    id: string;
    name: string;
    email: string;
    status: string;
    isActive: boolean;
    shiftType: 'DAY' | 'NIGHT';
    workStartTime: string;
    workEndTime: string;
    phone?: string;
}

export function ManageReceptionists() {
    const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        shiftType: 'DAY',
        workStartTime: '09:00',
        workEndTime: '17:00',
    });

    useEffect(() => {
        fetchReceptionists();
    }, []);

    const fetchReceptionists = async () => {
        try {
            const response = await apiClient.get('/admin/receptionists');
            // Filter out inactive ones in UI if backend returns them, or backend handles it.
            // Requirements say "Remove (deactivate)". Usually we hide them or show as Inactive.
            // I'll show only active ones or indicate status.
            // Let's filter active for now to "Remove" them effectively from view, or show "Inactive" badge.
            // I will show all but visually distinguish.
            setReceptionists(response.data.filter((r: any) => r.isActive));
        } catch (error) {
            console.error('Failed to fetch receptionists:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setFormData({
            name: '', email: '', password: '', phone: '',
            shiftType: 'DAY', workStartTime: '09:00', workEndTime: '17:00'
        });
        setModalOpen(true);
    };

    const handleRemove = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this receptionist? This action cannot be undone.')) return;
        try {
            await apiClient.delete(`/admin/receptionists/${id}`);
            fetchReceptionists();
            alert('Receptionist removed successfully');
        } catch (error) {
            console.error('Failed to remove receptionist:', error);
            alert('Failed to remove receptionist');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/admin/receptionists', formData);
            setModalOpen(false);
            fetchReceptionists();
            alert('Receptionist added successfully!');
        } catch (error) {
            console.error('Failed to create receptionist:', error);
            alert('Failed to create receptionist. Please check inputs.');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' as keyof Receptionist },
        { header: 'Email', accessor: 'email' as keyof Receptionist },
        {
            header: 'Shift', accessor: (row: Receptionist) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${row.shiftType === 'DAY' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-900 text-white'}`}>
                    {row.shiftType}
                </span>
            )
        },
        { header: 'Time', accessor: (row: Receptionist) => `${row.workStartTime} - ${row.workEndTime}` },
        {
            header: 'Actions',
            accessor: (row: Receptionist) => (
                <button
                    onClick={() => handleRemove(row.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove Receptionist"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            ),
        },
    ];

    return (
        <Layout title="Manage Receptionists">
            <Card
                title="Receptionists List"
                action={
                    <Button onClick={handleAdd} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Receptionist
                    </Button>
                }
            >
                {loading ? (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                ) : (
                    <Table data={receptionists as any[]} columns={columns as any} emptyMessage="No active receptionists found" />
                )}
            </Card>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Add New Receptionist"
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
                    <Input
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        placeholder="Min. 6 characters"
                    />
                    <Input
                        label="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shift Type</label>
                            <select
                                value={formData.shiftType}
                                onChange={(e) => setFormData({ ...formData, shiftType: e.target.value as 'DAY' | 'NIGHT' })}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="DAY">Day Shift</option>
                                <option value="NIGHT">Night Shift</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Start Time"
                            type="time"
                            value={formData.workStartTime}
                            onChange={(e) => setFormData({ ...formData, workStartTime: e.target.value })}
                            required
                        />
                        <Input
                            label="End Time"
                            type="time"
                            value={formData.workEndTime}
                            onChange={(e) => setFormData({ ...formData, workEndTime: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Add Receptionist
                        </Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
}
