import React from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Claim {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    notes?: string;
    policy: {
        policyNumber: string;
        providerName: string;
        patient: { user: { name: string } };
    };
}

interface ClaimsTableProps {
    claims: Claim[];
    onProcess: (claim: Claim) => void;
}

export const ClaimsTable: React.FC<ClaimsTableProps> = ({ claims, onProcess }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Claim Amount</th>
                        <th className="px-6 py-4">Patient</th>
                        <th className="px-6 py-4">Policy Info</th>
                        <th className="px-6 py-4">Date Submitted</th>
                        <th className="px-6 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {claims.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-8 text-gray-500">No claims found.</td></tr>
                    ) : (
                        claims.map(claim => (
                            <tr key={claim.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${claim.status === 'SUBMITTED' ? 'bg-orange-100 text-orange-700' :
                                            claim.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                claim.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-gray-100'
                                        }`}>
                                        {claim.status === 'SUBMITTED' ? <Clock size={12} /> :
                                            claim.status === 'APPROVED' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                        {claim.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">
                                    ${claim.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium">{claim.policy.patient.user?.name || 'Unknown'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium">{claim.policy.providerName}</div>
                                    <div className="text-xs text-gray-500 font-mono">{claim.policy.policyNumber}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(claim.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {claim.status === 'SUBMITTED' ? (
                                        <button
                                            onClick={() => onProcess(claim)}
                                            className="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-sky-100 transition whitespace-nowrap"
                                        >
                                            Process Claim
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-1 text-sm text-gray-500" title={claim.notes}>
                                            <FileText size={14} /> Details
                                        </div>
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
