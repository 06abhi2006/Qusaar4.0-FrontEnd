import React, { useState } from 'react';
import axios from 'axios';
import { X, Save, FileText } from 'lucide-react';

interface UpdateResultDialogProps {
    request: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const UpdateResultDialog: React.FC<UpdateResultDialogProps> = ({ request, isOpen, onClose, onSuccess }) => {
    const [result, setResult] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Assuming endpoint handled by controller
            await axios.put(`http://localhost:3000/api/lab/requests/${request.id}/result`, {
                resultValue: result,
                notes: notes,
                status: 'COMPLETED'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
            onClose();
            setResult('');
            setNotes('');
        } catch (error) {
            console.error('Failed to update result', error);
            alert('Failed to update result');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !request) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-blue-50">
                    <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                        <FileText size={20} /> Update Lab Result
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                <div className="p-6 bg-gray-50 border-b border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Test Name</div>
                    <div className="text-lg font-bold text-gray-800">{request.test.name}</div>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Patient:</span> <span className="font-semibold">{request.patient.user?.name || 'Unknown'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Normal Range:</span> <span className="font-medium text-blue-700">{request.test.normalRange || 'N/A'} {request.test.units}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Result Value *</label>
                        <div className="relative">
                            <input
                                required
                                autoFocus
                                type="text"
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                placeholder={`Enter value (e.g. 14.5)`}
                                value={result}
                                onChange={e => setResult(e.target.value)}
                            />
                            {request.test.units && (
                                <span className="absolute right-3 top-2.5 text-gray-400 text-sm font-medium">{request.test.units}</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Technician Notes</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Any observations or comments..."
                            rows={3}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} /> {loading ? 'Saving...' : 'Complete & Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
