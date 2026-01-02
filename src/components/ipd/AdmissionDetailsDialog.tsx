import React, { useState } from 'react';
import axios from 'axios';
import { X, LogOut, User, Stethoscope, Calendar } from 'lucide-react';
import { Bed } from '../../types/ipd';

interface AdmissionDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    bed: Bed | null;
    onDischarge: () => void;
}

export const AdmissionDetailsDialog: React.FC<AdmissionDetailsDialogProps> = ({ isOpen, onClose, bed, onDischarge }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !bed || !bed.admission) return null;

    const { admission } = bed;

    const handleDischarge = async () => {
        if (!confirm('Are you sure you want to discharge this patient? This action cannot be undone.')) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/ipd/discharge/${admission.id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onDischarge();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to discharge patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-blue-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Admission Details</h2>
                        <p className="text-sm text-gray-600">Bed: <span className="font-bold text-blue-700">{bed.bedNumber}</span></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-white rounded-full shadow-sm">
                                <User className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Patient</h3>
                                <p className="text-lg font-bold text-gray-900">{admission.patient.name}</p>
                                <p className="text-xs text-gray-500 font-mono">ID: {admission.patientId}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-100 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Stethoscope size={16} className="text-green-600" />
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Doctor</span>
                                </div>
                                <p className="font-medium text-gray-800">{admission.doctor.user.name}</p>
                            </div>
                            <div className="p-4 border border-gray-100 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar size={16} className="text-orange-600" />
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Admitted</span>
                                </div>
                                <p className="font-medium text-gray-800">{new Date(admission.admissionDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {admission.diagnosis && (
                            <div className="p-4 border border-gray-100 rounded-lg">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Diagnosis</h3>
                                <p className="text-gray-800">{admission.diagnosis}</p>
                            </div>
                        )}

                        {admission.notes && (
                            <div className="p-4 border border-gray-100 rounded-lg bg-yellow-50/50">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes</h3>
                                <p className="text-gray-800 text-sm italic">{admission.notes}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleDischarge}
                            disabled={loading}
                            className="w-full px-4 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <LogOut size={18} />
                            {loading ? 'Processing Discharge...' : 'Discharge Patient'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
