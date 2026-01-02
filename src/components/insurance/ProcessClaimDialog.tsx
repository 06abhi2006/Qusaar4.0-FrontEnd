import React, { useState } from 'react';
import axios from 'axios';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface ProcessClaimDialogProps {
    claim: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const ProcessClaimDialog: React.FC<ProcessClaimDialogProps> = ({ claim, isOpen, onClose, onSuccess }) => {
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleProcess = async (status: 'APPROVED' | 'REJECTED') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/insurance/claims/${claim.id}/status`, {
                status,
                notes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
            onClose();
            setNotes('');
        } catch (error) {
            console.error('Failed to process claim', error);
            alert('Failed to process claim');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !claim) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-sky-50">
                    <h2 className="text-xl font-bold text-sky-900">Process Insurance Claim</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                <div className="p-6 bg-gray-50 border-b border-gray-100">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-semibold">Claim Amount</div>
                            <div className="text-2xl font-bold text-gray-900">${claim.amount}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase font-semibold">Policy Limit</div>
                            <div className="text-lg font-medium text-gray-700">${claim.policy.coverageAmount.toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b pb-2 border-dashed border-gray-300">
                            <span className="text-gray-500">Patient</span>
                            <span className="font-semibold">{claim.policy.patient.user?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2 border-dashed border-gray-300">
                            <span className="text-gray-500">Provider</span>
                            <span className="font-semibold">{claim.policy.providerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Policy No</span>
                            <span className="font-mono">{claim.policy.policyNumber}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Processing Notes</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="Reason for approval or rejection..."
                            rows={3}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleProcess('REJECTED')}
                            disabled={loading}
                            className="w-full py-2.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-medium flex justify-center items-center gap-2 transition"
                        >
                            <XCircle size={18} /> Reject
                        </button>
                        <button
                            onClick={() => handleProcess('APPROVED')}
                            disabled={loading}
                            className="w-full py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium flex justify-center items-center gap-2 shadow-md transition"
                        >
                            <CheckCircle size={18} /> Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
