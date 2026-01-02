import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Activity, Search } from 'lucide-react';

interface ScheduleSurgeryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: () => void;
}

interface Doctor {
    id: string;
    user: {
        id: string;
        name: string;
    };
    specialization: string;
}

export const ScheduleSurgeryDialog: React.FC<ScheduleSurgeryDialogProps> = ({ isOpen, onClose, onSchedule }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        theaterName: '',
        procedureName: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
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
        setLoading(true);
        setError(null);

        // Construct ISO DateTimes
        const startDateTime = new Date(`${formData.date}T${formData.startTime}`).toISOString();
        const endDateTime = new Date(`${formData.date}T${formData.endTime}`).toISOString();

        if (new Date(startDateTime) >= new Date(endDateTime)) {
            setError('End time must be after start time');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/ot/schedule', {
                patientId: formData.patientId,
                doctorId: formData.doctorId,
                theaterName: formData.theaterName,
                procedureName: formData.procedureName,
                startTime: startDateTime,
                endTime: endDateTime,
                notes: formData.notes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onSchedule();
            onClose();
            // Reset form partly
            setFormData(prev => ({
                ...prev,
                patientId: '',
                procedureName: '',
                startTime: '',
                endTime: '',
                notes: ''
            }));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to schedule surgery');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-indigo-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Activity className="text-indigo-600" /> Schedule Surgery
                        </h2>
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
                                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.patientId}
                                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                placeholder="Enter Patient UUID..."
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Surgeon *</label>
                            <select
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Theater *</label>
                            <select
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.theaterName}
                                onChange={(e) => setFormData({ ...formData, theaterName: e.target.value })}
                            >
                                <option value="">Select OT</option>
                                <option value="OT-1">Theater 1 (General)</option>
                                <option value="OT-2">Theater 2 (Cardiac)</option>
                                <option value="OT-3">Theater 3 (Ortho)</option>
                                <option value="OT-4">Theater 4 (Neuro)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Procedure Name *</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.procedureName}
                            onChange={(e) => setFormData({ ...formData, procedureName: e.target.value })}
                            placeholder="e.g. Appendectomy"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                            <input
                                type="time"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                            <input
                                type="time"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Pre-op instructions or notes..."
                        />
                    </div>

                    <div className="flex justify-end pt-4 gap-3 border-t border-gray-100">
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
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50"
                        >
                            {loading ? 'Scheduling...' : 'Schedule Surgery'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
