import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Search } from 'lucide-react';
import { Bed } from '../../types/ipd';

interface AdmitPatientDialogProps {
    isOpen: boolean;
    onClose: () => void;
    bed: Bed | null;
    onAdmit: () => void;
}

interface Doctor {
    id: string;
    user: {
        id: string;
        name: string;
    };
    specialization: string;
}

export const AdmitPatientDialog: React.FC<AdmitPatientDialogProps> = ({ isOpen, onClose, bed, onAdmit }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        diagnosis: '',
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchDoctors();
        }
    }, [isOpen]);

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            // Assuming we have an endpoint to get doctors. If not, we might need to adjust.
            // Based on previous knowledge, /api/admin/doctors or /api/doctor/search might exist and return list.
            // Let's try a common pattern or search based on prior conversational context.
            // Using /api/admin/doctors for now as it usually lists all.
            const response = await axios.get('http://localhost:3000/api/admin/doctors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(response.data);
        } catch (err) {
            console.error('Failed to fetch doctors', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bed) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/ipd/admit', {
                ...formData,
                bedId: bed.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onAdmit();
            onClose();
            // Reset form
            setFormData({
                patientId: '',
                doctorId: '',
                diagnosis: '',
                notes: ''
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to admit patient');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !bed) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Admit Patient</h2>
                        <p className="text-sm text-gray-500">Bed: <span className="font-bold text-blue-600">{bed.bedNumber}</span></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID *</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.patientId}
                                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                placeholder="Enter Patient UUID..."
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">UUID string required.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Doctor *</label>
                        <select
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.doctorId}
                            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.user.name} ({doc.specialization})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.diagnosis}
                            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                            placeholder="Initial diagnosis..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            rows={2}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Admission notes..."
                        />
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                        >
                            {loading ? 'Admitting...' : 'Admit Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
