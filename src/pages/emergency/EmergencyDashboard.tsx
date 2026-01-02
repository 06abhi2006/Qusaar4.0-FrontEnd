import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EmergencyCase } from '../../types/emergency';
import { TriageBadge } from '../../components/emergency/TriageBadge';
import { CreateCaseDialog } from '../../components/emergency/CreateCaseDialog';
import { ManageCaseDialog } from '../../components/emergency/ManageCaseDialog';
import { AlertTriangle, Plus, Activity } from 'lucide-react';

export const EmergencyDashboard: React.FC = () => {
    const [cases, setCases] = useState<EmergencyCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/emergency', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCases(response.data);
        } catch (error) {
            console.error('Error fetching emergency cases:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleManage = (c: EmergencyCase) => {
        setSelectedCase(c);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-red-700 flex items-center gap-2">
                    <AlertTriangle className="text-red-600" /> Emergency Department
                </h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 shadow-md transition-all"
                >
                    <Plus size={18} /> New Emergency Case
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptoms</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Triage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival Time</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>
                            ) : cases.length === 0 ? (
                                <tr><td colSpan={6} className="p-4 text-center text-gray-500">No active emergency cases.</td></tr>
                            ) : (
                                cases.map((c) => (
                                    <tr key={c.id} className="hover:bg-red-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{c.patientName || 'Unknown Details'}</div>
                                            {c.patientId && <div className="text-xs text-gray-500">ID: {c.patientId}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 truncate max-w-xs">{c.symptoms}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <TriageBadge level={c.triageLevel} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {c.status}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(c.createdAt).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleManage(c)}
                                                className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1 ml-auto"
                                            >
                                                <Activity size={16} /> Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateCaseDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={fetchCases}
            />

            <ManageCaseDialog
                isOpen={!!selectedCase}
                caseData={selectedCase}
                onClose={() => setSelectedCase(null)}
                onUpdate={() => {
                    fetchCases();
                    setSelectedCase(null);
                }}
            />
        </div>
    );
};
