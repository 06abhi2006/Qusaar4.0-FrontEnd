import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Microscope, FlaskConical, ClipboardList } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { TestCatalog } from '../../components/lab/TestCatalog';
import { LabRequestTable } from '../../components/lab/LabRequestTable';
import { UpdateResultDialog } from '../../components/lab/UpdateResultDialog';

export const LabDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'requests' | 'catalog'>('requests');
    const [requests, setRequests] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (activeTab === 'requests') {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lab/requests`, config);
                setRequests(res.data);
            } else {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lab/tests`, config);
                setTests(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch lab data', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Laboratory & Pathology">
            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Microscope className="text-indigo-600" /> Laboratory & Pathology
                            </h1>
                            <p className="text-gray-500">Manage tests, process requests, and update results.</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex gap-2 w-fit">
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'requests' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <ClipboardList size={16} /> Lab Requests
                        </button>
                        <button
                            onClick={() => setActiveTab('catalog')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'catalog' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <FlaskConical size={16} /> Test Catalog
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px] p-6">
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Loading data...</div>
                        ) : activeTab === 'requests' ? (
                            <LabRequestTable
                                requests={requests}
                                onUpdateResult={(req) => setSelectedRequest(req)}
                            />
                        ) : (
                            <TestCatalog tests={tests} onRefresh={fetchData} />
                        )}
                    </div>
                </div>

                <UpdateResultDialog
                    isOpen={!!selectedRequest}
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onSuccess={fetchData}
                />
            </div>
        </Layout>
    );
};
