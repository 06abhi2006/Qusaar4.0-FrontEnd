import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, CreditCard, Download, FileText, CheckCircle, Clock } from 'lucide-react';
import apiClient from '../../lib/api';

interface Bill {
    id: string;
    patient: {
        user: {
            name: string;
            email: string;
        }
    };
    doctor: {
        user: {
            name: string;
        }
    };
    amount: number;
    status: 'PENDING' | 'PAID';
    createdAt: string;
    paymentDate?: string;
}

export function CashierDashboard() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async (search?: string) => {
        setLoading(true);
        try {
            const params = search ? { search } : {};
            const response = await apiClient.get('/cashier/bills', { params });
            setBills(response.data);
        } catch (error) {
            console.error('Failed to fetch bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchBills(searchTerm);
    };

    const handlePayment = async (billId: string) => {
        if (!window.confirm('Confirm payment reception? This action cannot be undone.')) return;

        setProcessingId(billId);
        try {
            await apiClient.post(`/cashier/bills/${billId}/pay`);
            // Refresh list to show updated status (or remove if we only show pending?)
            // Let's keep it simple: refresh.
            fetchBills(searchTerm);
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDownloadPDF = async (billId: string) => {
        try {
            const response = await apiClient.get(`/cashier/bills/${billId}/pdf`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `bill_${billId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download PDF');
        }
    };

    return (
        <Layout title="Cash Counter">
            <div className="space-y-6">
                {/* Search Header */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Search by Patient Name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>
                </div>

                {/* Bills List */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading billing information...</td>
                                    </tr>
                                ) : bills.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No pending bills found.</td>
                                    </tr>
                                ) : (
                                    bills.map((bill) => (
                                        <tr key={bill.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">#{bill.id.slice(0, 8)}</div>
                                                <div className="text-sm text-gray-500">{new Date(bill.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{bill.patient.user.name}</div>
                                                <div className="text-sm text-gray-500">{bill.patient.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">Dr. {bill.doctor.user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">${bill.amount.toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {bill.status === 'PAID' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Paid
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <Clock className="w-3 h-3 mr-1" /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                {bill.status === 'PENDING' && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handlePayment(bill.id)}
                                                        disabled={processingId === bill.id}
                                                    >
                                                        <CreditCard className="w-4 h-4 mr-1" />
                                                        {processingId === bill.id ? 'Processing...' : 'Pay Now'}
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleDownloadPDF(bill.id)}
                                                >
                                                    <FileText className="w-4 h-4 mr-1" />
                                                    View Bill
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </Layout>
    );
}
