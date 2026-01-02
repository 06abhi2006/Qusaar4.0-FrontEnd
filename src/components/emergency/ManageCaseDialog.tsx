import React, { useState } from 'react';
import axios from 'axios';
import { X, AlertTriangle, Activity, UserPlus } from 'lucide-react';
import { EmergencyCase, TriageLevel, EmergencyStatus } from '../../types/emergency';
import { TriageBadge } from './TriageBadge';

interface ManageCaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    caseData: EmergencyCase | null;
    onUpdate: () => void;
}

export const ManageCaseDialog: React.FC<ManageCaseDialogProps> = ({ isOpen, onClose, caseData, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [providerId, setProviderId] = useState('');

    if (!isOpen || !caseData) return null;

    const handleTriageUpdate = async (level: TriageLevel) => {
        setLoading(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/emergency/${caseData.id}/triage`,
                { level },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: 'Triage level updated' });
            onUpdate();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update triage' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (status: EmergencyStatus) => {
        setLoading(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/emergency/${caseData.id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: 'Status updated' });
            onUpdate();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update status' });
        } finally {
            setLoading(false);
        }
    };

    const handleAssignProvider = async () => {
        if (!providerId.trim()) return;
        setLoading(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/emergency/${caseData.id}/assign`,
                { providerId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: 'Provider assigned successfully' });
            setProviderId('');
            onUpdate();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to assign provider' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-fadeIn h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-gray-800">Manage Case</h2>
                            <TriageBadge level={caseData.triageLevel} />
                        </div>
                        <p className="text-sm text-gray-500">ID: {caseData.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Patient Info */}
                    <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
                        <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase">Patient</span>
                            <div className="text-lg font-bold text-gray-800">{caseData.patientName || 'Unknown'}</div>
                            {caseData.patientId && <div className="text-sm text-gray-600">ID: {caseData.patientId}</div>}
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase">Symptoms</span>
                            <div className="text-gray-800">{caseData.symptoms}</div>
                        </div>
                    </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Triage Section */}
                        <div className="border border-gray-200 rounded-xl p-4">
                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <AlertTriangle size={16} /> Update Triage
                            </h3>
                            <div className="flex flex-col gap-2">
                                {Object.values(TriageLevel).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => handleTriageUpdate(level)}
                                        disabled={loading || caseData.triageLevel === level}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left flex justify-between items-center
                                            ${caseData.triageLevel === level
                                                ? 'bg-gray-100 text-gray-800 border-2 border-gray-300 ring-0'
                                                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                                            }`}
                                    >
                                        {level}
                                        {caseData.triageLevel === level && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">Current</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className="border border-gray-200 rounded-xl p-4">
                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <Activity size={16} /> Update Status
                            </h3>
                            <div className="flex flex-col gap-2">
                                {Object.values(EmergencyStatus).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(status)}
                                        disabled={loading || caseData.status === status}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left flex justify-between items-center
                                            ${caseData.status === status
                                                ? 'bg-gray-100 text-gray-800 border-2 border-gray-300'
                                                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                                            }`}
                                    >
                                        {status}
                                        {caseData.status === status && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">Current</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Provider Assignment */}
                        <div className="md:col-span-2 border border-gray-200 rounded-xl p-4">
                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <UserPlus size={16} /> Assign Care Provider
                            </h3>
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-500 mb-1">Provider ID (Doctor/Nurse)</label>
                                    <input
                                        type="text"
                                        value={providerId}
                                        onChange={(e) => setProviderId(e.target.value)}
                                        placeholder="Enter Provider UUID..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <button
                                    onClick={handleAssignProvider}
                                    disabled={loading || !providerId.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                                >
                                    Assign
                                </button>
                            </div>
                            {caseData.careProviderId && (
                                <div className="mt-2 text-xs text-gray-500">
                                    Current Provider ID: <span className="font-mono bg-gray-100 px-1 rounded">{caseData.careProviderId}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
