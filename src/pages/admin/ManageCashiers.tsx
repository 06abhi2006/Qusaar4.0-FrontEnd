import { useState, useEffect, FormEvent } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { UserPlus, Trash2, Clock, Moon, Sun } from 'lucide-react';
import apiClient from '../../lib/api';

export function ManageCashiers() {
    const [cashiers, setCashiers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        shiftType: 'DAY',
        workStartTime: '09:00',
        workEndTime: '17:00'
    });

    useEffect(() => {
        fetchCashiers();
    }, []);

    const fetchCashiers = async () => {
        try {
            const response = await apiClient.get('/admin/cashiers');
            setCashiers(response.data);
        } catch (error) {
            console.error('Failed to fetch cashiers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/admin/cashiers', formData);
            setIsModalOpen(false);
            setFormData({
                name: '',
                email: '',
                password: '',
                shiftType: 'DAY',
                workStartTime: '09:00',
                workEndTime: '17:00'
            });
            fetchCashiers();
        } catch (error) {
            console.error('Failed to create cashier:', error);
            alert('Failed to create cashier');
        }
    };

    const handleLink = (path: string) => {
        window.location.href = path; // Simple navigation
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this cashier?')) return;
        try {
            await apiClient.delete(`/admin/cashiers/${id}`);
            fetchCashiers();
        } catch (error) {
            console.error('Failed to delete cashier:', error);
            alert('Failed to delete cashier');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        {
            header: 'Shift',
            accessor: (row: any) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.shiftType === 'DAY' ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                    {row.shiftType === 'DAY' ? <Sun className="w-3 h-3 mr-1" /> : <Moon className="w-3 h-3 mr-1" />}
                    {row.shiftType}
                </span>
            ),
        },
        {
            header: 'Time',
            accessor: (row: any) => (
                <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {row.workStartTime} - {row.workEndTime}
                </div>
            ),
        },
        {
            header: 'Actions',
            accessor: (row: any) => (
                <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            ),
        },
    ];

    return (
        <Layout title="Manage Cashiers">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Cash Counter Staff</h2>
                <Button onClick={() => setIsModalOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New Cashier
                </Button>
            </div>

            <Card>
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : (
                    <Table data={cashiers} columns={columns} emptyMessage="No cashiers found" />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Cashier"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    <Input label="Password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shift Type</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.shiftType}
                            onChange={e => setFormData({ ...formData, shiftType: e.target.value })}
                        >
                            <option value="DAY">Day Shift</option>
                            <option value="NIGHT">Night Shift</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Start Time" type="time" value={formData.workStartTime} onChange={e => setFormData({ ...formData, workStartTime: e.target.value })} required />
                        <Input label="End Time" type="time" value={formData.workEndTime} onChange={e => setFormData({ ...formData, workEndTime: e.target.value })} required />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Cashier</Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
}
