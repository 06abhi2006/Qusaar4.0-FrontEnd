import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BedGrid } from '../../components/ipd/BedGrid';
import { Layout } from '../../components/Layout';
import { Ward, Bed, BedStatus } from '../../types/ipd';
import { Building2, Plus } from 'lucide-react';
import { AdmitPatientDialog } from '../../components/ipd/AdmitPatientDialog';
import { AdmissionDetailsDialog } from '../../components/ipd/AdmissionDetailsDialog';

export const IPDDashboard: React.FC = () => {
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
    const [loading, setLoading] = useState(true);

    // Dialog States
    const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
    const [isAdmitOpen, setIsAdmitOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        fetchWards();
    }, []);

    const fetchWards = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/ipd/wards`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWards(response.data);
            if (response.data.length > 0 && !selectedWard) {
                setSelectedWard(response.data[0]);
            } else if (selectedWard) {
                // Refresh currently selected ward data
                const updatedWard = response.data.find((w: Ward) => w.id === selectedWard.id);
                if (updatedWard) setSelectedWard(updatedWard);
            }
        } catch (error) {
            console.error('Error fetching wards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBedClick = (bed: Bed) => {
        setSelectedBed(bed);
        if (bed.status === BedStatus.AVAILABLE) {
            setIsAdmitOpen(true);
        } else if (bed.status === BedStatus.OCCUPIED) {
            setIsDetailsOpen(true);
        }
    };

    const handleGeneralAdmit = () => {
        // For now, general admit just opens the dialog with no bed selected
        // Or we could force them to select a bed first.
        // Better UX: Show a notification "Please select an available bed"
        alert('Please select an available (GREEN) bed to admit a patient.');
    };

    const handleSuccess = () => {
        fetchWards();
    };

    if (loading) return <div className="p-8">Loading IPD Dashboard...</div>;

    return (
        <Layout title="In-Patient Department (IPD)">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Building2 /> In-Patient Department (IPD)
                    </h1>
                    <button
                        onClick={handleGeneralAdmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md"
                    >
                        <Plus size={18} /> Admit Patient
                    </button>
                </div>

                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                    {wards.map(ward => (
                        <button
                            key={ward.id}
                            onClick={() => setSelectedWard(ward)}
                            className={`
                  px-4 py-3 rounded-lg border min-w-[150px] text-left transition-all
                  ${selectedWard?.id === ward.id
                                    ? 'bg-blue-50 border-blue-500 shadow-sm'
                                    : 'bg-white border-gray-200 hover:bg-gray-50'}
                `}
                        >
                            <div className="font-semibold text-gray-800">{ward.name}</div>
                            <div className="text-sm text-gray-500">
                                Floor: {ward.floor} • Cap: {ward.capacity}
                            </div>
                        </button>
                    ))}
                </div>

                {selectedWard && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">
                            Bed Availability - {selectedWard.name}
                        </h2>
                        <BedGrid beds={selectedWard.beds} onSelectBed={handleBedClick} />
                    </div>
                )}

                <AdmitPatientDialog
                    isOpen={isAdmitOpen}
                    onClose={() => { setIsAdmitOpen(false); setSelectedBed(null); }}
                    bed={selectedBed}
                    onAdmit={handleSuccess}
                />

                <AdmissionDetailsDialog
                    isOpen={isDetailsOpen}
                    onClose={() => { setIsDetailsOpen(false); setSelectedBed(null); }}
                    bed={selectedBed}
                    onDischarge={handleSuccess}
                />
            </div>
        </Layout>
    );
};
