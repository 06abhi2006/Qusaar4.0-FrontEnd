import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

interface LabRequest {
    id: string;
    patient: { user: { name: string }; age: number; gender: string };
    doctor: { user: { name: string } };
    test: { name: string; code: string };
    status: string;
    requestedAt: string;
    resultValue?: string;
}

interface LabRequestTableProps {
    requests: LabRequest[];
    onUpdateResult: (req: LabRequest) => void;
}

export const LabRequestTable: React.FC<LabRequestTableProps> = ({ requests, onUpdateResult }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Test Details</th>
                        <th className="px-6 py-4">Patient Info</th>
                        <th className="px-6 py-4">Doctor</th>
                        <th className="px-6 py-4">Requested At</th>
                        <th className="px-6 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {requests.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-8 text-gray-500">No requests found.</td></tr>
                    ) : (
                        requests.map(req => (
                            <tr key={req.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${req.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                        req.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                                        }`}>
                                        {req.status === 'PENDING' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{req.test.name}</div>
                                    <div className="text-xs text-gray-500 font-mono">{req.test.code}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium">{req.patient.user?.name || 'Unknown'}</div>
                                    <div className="text-xs text-gray-500">{req.patient.gender}, {req.patient.age}yo</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {req.doctor.user?.name || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(req.requestedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {req.status === 'PENDING' && (
                                        <button
                                            onClick={() => onUpdateResult(req)}
                                            className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                                        >
                                            Update Result
                                        </button>
                                    )}
                                    {req.status === 'COMPLETED' && (
                                        <span className="font-mono font-bold text-gray-800">{req.resultValue}</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
