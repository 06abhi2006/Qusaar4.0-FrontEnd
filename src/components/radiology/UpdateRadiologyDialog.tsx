import React, { useState } from 'react';
import axios from 'axios';
import { X, Save, FileText, Image as ImageIcon } from 'lucide-react';

interface UpdateRadiologyDialogProps {
    request: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const UpdateRadiologyDialog: React.FC<UpdateRadiologyDialogProps> = ({ request, isOpen, onClose, onSuccess }) => {
    const [findings, setFindings] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [reportUrl, setReportUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/radiology/requests/${request.id}`, {
                findings,
                imageUrl,
                reportUrl,
                status: 'COMPLETED'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
            onClose();
            // Reset state
            setFindings('');
            setImageUrl('');
            setReportUrl('');
        } catch (error) {
            console.error('Failed to update radiology request', error);
            alert('Failed to update request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !request) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-purple-50">
                    <h2 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                        <FileText size={20} /> Complete Scan
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                <div className="p-6 bg-gray-50 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Scan Type</div>
                            <div className="text-lg font-bold text-gray-800">{request.testType} - {request.bodyPart}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">Patient</div>
                            <div className="font-semibold">{request.patient.user?.name || 'Unknown'}</div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Findings / Report *</label>
                        <textarea
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Detailed findings from the scan..."
                            rows={4}
                            value={findings}
                            onChange={e => setFindings(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="http://example.com/scan.jpg"
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 shadow-md flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} /> {loading ? 'Saving...' : 'Complete & Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
