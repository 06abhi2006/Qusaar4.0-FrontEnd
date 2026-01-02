import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import apiClient from '../../lib/api';

interface BookAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function BookAppointmentModal({ isOpen, onClose, onSuccess }: BookAppointmentModalProps) {
    const [problemDescription, setProblemDescription] = useState('');
    const [urgency, setUrgency] = useState<'NORMAL' | 'HIGH'>('NORMAL');
    const [preferredDate, setPreferredDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await apiClient.post('/patient/appointments', {
                problemDescription,
                urgency,
                preferredDate: preferredDate || undefined,
            });

            onSuccess();
            onClose();
            // Reset form
            setProblemDescription('');
            setUrgency('NORMAL');
            setPreferredDate('');
        } catch (err: any) {
            console.error('Booking failed:', err);
            setError(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Book Appointment">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Problem Description
                    </label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        value={problemDescription}
                        onChange={(e) => setProblemDescription(e.target.value)}
                        placeholder="Describe your symptoms or reason for visit..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Urgency Level
                    </label>
                    <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value as 'NORMAL' | 'HIGH')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>

                <Input
                    label="Preferred Date (Optional)"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                />

                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} disabled={loading}>
                        Book Appointment
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
