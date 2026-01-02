import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Save, X } from 'lucide-react';

interface LabTest {
    id: string;
    name: string;
    code: string;
    category: string;
    price: number;
    normalRange?: string;
    units?: string;
}

interface TestCatalogProps {
    tests: LabTest[];
    onRefresh: () => void;
}

export const TestCatalog: React.FC<TestCatalogProps> = ({ tests, onRefresh }) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        category: '',
        price: 0,
        normalRange: '',
        units: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/lab/tests', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAddOpen(false);
            onRefresh();
            setFormData({ name: '', code: '', category: '', price: 0, normalRange: '', units: '' });
        } catch (error) {
            console.error('Failed to add test', error);
            alert('Failed to add test');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Available Tests</h3>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus size={18} /> Add New Test
                </button>
            </div>

            {isAddOpen && (
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 animate-fadeIn">
                    <div className="flex justify-between mb-4">
                        <h4 className="font-semibold text-indigo-900">New Test Details</h4>
                        <button onClick={() => setIsAddOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            placeholder="Test Name (e.g. CBC)"
                            required className="input-field p-2 rounded border"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            placeholder="Code (e.g. LAB-001)"
                            required className="input-field p-2 rounded border"
                            value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })}
                        />
                        <input
                            placeholder="Category (e.g. Hematology)"
                            required className="input-field p-2 rounded border"
                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                        />
                        <input
                            placeholder="Price" type="number"
                            required className="input-field p-2 rounded border"
                            value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        />
                        <input
                            placeholder="Normal Range (e.g. 13-17)"
                            className="input-field p-2 rounded border"
                            value={formData.normalRange} onChange={e => setFormData({ ...formData, normalRange: e.target.value })}
                        />
                        <input
                            placeholder="Units (e.g. g/dL)"
                            className="input-field p-2 rounded border"
                            value={formData.units} onChange={e => setFormData({ ...formData, units: e.target.value })}
                        />
                        <div className="md:col-span-2 flex justify-end">
                            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                                <Save size={18} /> Save Test
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Code</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Range/Units</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tests.map(test => (
                            <tr key={test.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{test.name}</td>
                                <td className="px-6 py-4 text-gray-600 font-mono text-xs">{test.code}</td>
                                <td className="px-6 py-4 text-gray-600">{test.category}</td>
                                <td className="px-6 py-4 font-semibold text-gray-900">${test.price}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm">
                                    {test.normalRange} {test.units}
                                </td>
                            </tr>
                        ))}
                        {tests.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No tests defined yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
