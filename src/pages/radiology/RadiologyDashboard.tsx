import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Radiation, List, CheckCircle } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { RadiologyRequestList } from '../../components/radiology/RadiologyRequestList';
import { UpdateRadiologyDialog } from '../../components/radiology/UpdateRadiologyDialog';

export const RadiologyDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    useEffect(() => {
        fetchRequests();
    }, [activeTab]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Backend supports status filtering if we want, or we can filter client side.
            // Let's filter client side for simplicity if API returns all, or pass status param.
            // Based on controller: status query param is supported.
            const status = activeTab === 'pending' ? 'PENDING' : 'COMPLETED';
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/radiology/requests?status=${status}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (error) {
            console.error('Failed to fetch radiology requests', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Radiology & Imaging">
            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Radiation className="text-purple-600" /> Radiology & Imaging
                            </h1>
                            <p className="text-gray-500">Manage X-Rays, CT Scans, MRIs and Ultrasounds.</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex gap-2 w-fit">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <List size={16} /> Pending Scans
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'completed' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <CheckCircle size={16} /> Completed
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px] p-6">
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Loading requests...</div>
                        ) : (
                            <RadiologyRequestList
                                requests={requests}
                                onProcess={(req) => setSelectedRequest(req)}
                            />
                        )}
                    </div>
                </div>

                <UpdateRadiologyDialog
                    isOpen={!!selectedRequest}
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onSuccess={fetchRequests}
                />
            </div>
        </Layout>
    );
};
