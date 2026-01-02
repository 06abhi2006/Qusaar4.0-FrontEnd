import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pill, Plus, Search, AlertOctagon, Package } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { InventoryTable } from '../../components/pharmacy/InventoryTable';
import { AddMedicineDialog } from '../../components/pharmacy/AddMedicineDialog';

export const PharmacyDashboard: React.FC = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/pharmacy/inventory`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInventory(response.data);
        } catch (error) {
            console.error('Failed to fetch inventory', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSearch = (term: string) => {
        setSearchTerm(term);
    };

    const filteredInventory = inventory.filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const lowStockCount = inventory.filter((item: any) => item.stock <= 10).length;

    return (
        <Layout title="Pharmacy Inventory">
            <div className="p-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Header Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                            <div className="p-4 bg-teal-100 text-teal-600 rounded-full">
                                <Pill size={32} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 font-medium">Total Medicines</div>
                                <div className="text-2xl font-bold text-gray-800">{inventory.length}</div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                            <div className="p-4 bg-red-100 text-red-600 rounded-full">
                                <AlertOctagon size={32} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 font-medium">Low Stock Items</div>
                                <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                            <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
                                <Package size={32} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 font-medium">Inventory Value</div>
                                <div className="text-2xl font-bold text-gray-800">
                                    ${inventory.reduce((acc: number, item: any) => acc + (item.unitPrice * item.stock), 0).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h2 className="text-xl font-bold text-gray-800">Pharmacy Inventory</h2>

                            <div className="flex gap-4 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search medicines..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={searchTerm}
                                        onChange={(e) => handleEditSearch(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => setIsAddOpen(true)}
                                    className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 shadow-md transition-colors whitespace-nowrap"
                                >
                                    <Plus size={18} /> Add Medicine
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-gray-500">Loading inventory...</div>
                        ) : (
                            <InventoryTable
                                items={filteredInventory}
                                onEdit={(item: any) => alert(`Edit logic for ${item.name} coming soon!`)}
                            />
                        )}
                    </div>
                </div>

                <AddMedicineDialog
                    isOpen={isAddOpen}
                    onClose={() => setIsAddOpen(false)}
                    onSuccess={fetchInventory}
                />
            </div>
        </Layout>
    );
};
