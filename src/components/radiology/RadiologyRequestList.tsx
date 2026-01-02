import React from 'react';
import { Clock, CheckCircle, Activity } from 'lucide-react';

interface RadiologyRequest {
    id: string;
    patient: { user: { name: string }; age: number; gender: string };
    doctor: { user: { name: string } };
    testType: string;
    bodyPart: string;
    status: string;
    requestedAt: string;
    findings?: string;
}

interface RadiologyRequestListProps {
    requests: RadiologyRequest[];
    onProcess: (req: RadiologyRequest) => void;
}

export const RadiologyRequestList: React.FC<RadiologyRequestListProps> = ({ requests, onProcess }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Scan Details</th>
                        <th className="px-6 py-4">Patient Info</th>
                        <th className="px-6 py-4">Requesting Doctor</th>
                        <th className="px-6 py-4">Date</th>
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
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                            <Activity size={18} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{req.testType}</div>
                                            <div className="text-xs text-gray-500">{req.bodyPart}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium">{req.patient.user?.name || 'Unknown'}</div>
                                    <div className="text-xs text-gray-500">{req.patient.gender}, {req.patient.age}yo</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    Dr. {req.doctor.user?.name || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(req.requestedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {req.status === 'PENDING' ? (
                                        <button
                                            onClick={() => onProcess(req)}
                                            className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-100 transition"
                                        >
                                            Process Scan
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-500 italic truncate max-w-[150px] inline-block" title={req.findings}>
                                            {req.findings || 'Completed'}
                                        </span>
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
