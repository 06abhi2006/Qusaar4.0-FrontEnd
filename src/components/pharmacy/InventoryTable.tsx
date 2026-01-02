import React from 'react';
import { Edit2, AlertTriangle, Syringe } from 'lucide-react';

interface InventoryItem {
    id: string;
    name: string;
    category?: string;
    stock: number;
    unitPrice: number;
    expiryDate?: string;
    batchNumber?: string;
}

interface InventoryTableProps {
    items: InventoryItem[];
    onEdit: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                        <th className="px-6 py-4">Medicine Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Batch No.</th>
                        <th className="px-6 py-4">Expiry Date</th>
                        <th className="px-6 py-4 text-right">Price</th>
                        <th className="px-6 py-4 text-center">Stock</th>
                        <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500 italic">
                                No medicines found in inventory.
                            </td>
                        </tr>
                    ) : (
                        items.map((item) => {
                            const isLowStock = item.stock <= 10;
                            return (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                                <Syringe size={18} />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{item.name}</div>
                                                <div className="text-xs text-gray-400">ID: {item.id.slice(0, 8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.category || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{item.batchNumber || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium text-right">
                                        ${item.unitPrice.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {isLowStock && <AlertTriangle size={12} />}
                                            {item.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                                            title="Edit Stock"
                                        >
                                            <Edit2 size={18} />
                                        </button>
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
