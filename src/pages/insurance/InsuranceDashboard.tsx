import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, FileText, CheckSquare, Plus } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { PolicyList } from '../../components/insurance/PolicyList';
import { ClaimsTable } from '../../components/insurance/ClaimsTable';
import { ProcessClaimDialog } from '../../components/insurance/ProcessClaimDialog';

export const InsuranceDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'claims' | 'policies'>('claims');
    const [claims, setClaims] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (activeTab === 'claims') {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/insurance/claims`, config);
                setClaims(res.data);
            } else {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/insurance/policies`, config);
                setPolicies(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch insurance data', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Insurance & Claims">
            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Shield className="text-sky-600" /> Insurance & Claims
                            </h1>
                            <p className="text-gray-500">Manage patient policies and adjudicate claims.</p>
                        </div>
                        {activeTab === 'policies' && (
                            <button
                                onClick={() => alert('Add Policy Dialog would open here')}
                                className="bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-sky-700 shadow-md transition"
                            >
                                <Plus size={18} /> Add Policy
                            </button>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex gap-2 w-fit">
                        <button
                            onClick={() => setActiveTab('claims')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'claims' ? 'bg-sky-50 text-sky-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <CheckSquare size={16} /> Claims Processing
                        </button>
                        <button
                            onClick={() => setActiveTab('policies')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'policies' ? 'bg-sky-50 text-sky-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <FileText size={16} /> Active Policies
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px] p-6">
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Loading data...</div>
                        ) : activeTab === 'claims' ? (
                            <ClaimsTable
                                claims={claims}
                                onProcess={(claim) => setSelectedClaim(claim)}
                            />
                        ) : (
                            <PolicyList policies={policies} />
                        )}
                    </div>
                </div>

                <ProcessClaimDialog
                    isOpen={!!selectedClaim}
                    claim={selectedClaim}
                    onClose={() => setSelectedClaim(null)}
                    onSuccess={fetchData}
                />
            </div>
        </Layout>
    );
};
