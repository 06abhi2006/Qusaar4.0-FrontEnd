import React from 'react';
import { Shield, ShieldCheck } from 'lucide-react';

interface Policy {
    id: string;
    patient: { user: { name: string } };
    providerName: string;
    policyNumber: string;
    coverageAmount: number;
    validFrom: string;
    validTill: string;
}

interface PolicyListProps {
    policies: Policy[];
}

export const PolicyList: React.FC<PolicyListProps> = ({ policies }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <th className="px-6 py-4">Policy Holder</th>
                        <th className="px-6 py-4">Provider</th>
                        <th className="px-6 py-4">Policy Number</th>
                        <th className="px-6 py-4 text-right">Coverage Limit</th>
                        <th className="px-6 py-4">Validity</th>
                        <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {policies.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-8 text-gray-500">No active policies found.</td></tr>
                    ) : (
                        policies.map(policy => {
                            const isValid = new Date(policy.validTill) > new Date();
                            return (
                                <tr key={policy.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {policy.patient.user?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Shield className="text-blue-500" size={16} />
                                            {policy.providerName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                        {policy.policyNumber}
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                        ${policy.coverageAmount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(policy.validFrom).toLocaleDateString()} - {new Date(policy.validTill).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {isValid ? <ShieldCheck size={12} /> : <Shield size={12} />}
                                            {isValid ? 'Active' : 'Expired'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};
