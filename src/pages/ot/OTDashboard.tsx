import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { OperationSchedule, OperationStatus } from '../../types/ot';
import { Calendar, Clock, User, Activity, CheckCircle, XCircle, PlayCircle } from 'lucide-react';
import { ScheduleSurgeryDialog } from '../../components/ot/ScheduleSurgeryDialog';

export const OTDashboard: React.FC = () => {
  const [operations, setOperations] = useState<OperationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  useEffect(() => {
    fetchOperations();
  }, [selectedDate]);

  const fetchOperations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/ot?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOperations(response.data);
    } catch (error) {
      console.error('Error fetching operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: OperationStatus) => {
    if (!confirm(`Are you sure you want to change status to ${status}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/ot/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOperations(); // Refresh list
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update operation status');
    }
  };

  const getStatusColor = (status: OperationStatus) => {
    switch (status) {
      case OperationStatus.SCHEDULED: return 'bg-blue-100 text-blue-800';
      case OperationStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-800 animate-pulse';
      case OperationStatus.COMPLETED: return 'bg-green-100 text-green-800';
      case OperationStatus.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
          <Activity className="text-indigo-600" /> Operation Theatre Management
        </h1>
        <div className="flex gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 shadow-md transition-colors"
          >
            <Calendar size={18} /> Schedule Surgery
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center p-8 text-gray-500">Loading schedule...</div>
        ) : operations.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500 font-medium">No surgeries scheduled for this date.</p>
          </div>
        ) : (
          operations.map((op) => (
            <div key={op.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 relative overflow-hidden transition-shadow hover:shadow-md">
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${op.status === 'SCHEDULED' ? 'bg-blue-500' :
                op.status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                  op.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'
                }`} />

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{op.procedureName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(op.status)}`}>
                    {op.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span>Patient: <span className="font-semibold text-gray-900">{op.patient.name}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-gray-400" />
                    <span>Surgeon: <span className="font-semibold text-gray-900">{op.doctor.user.name}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>Time: {new Date(op.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(op.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-gray-400" />
                    <span>Theater: <span className="font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{op.theaterName}</span></span>
                  </div>
                </div>

                {op.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700 italic border border-gray-100">
                    "{op.notes}"
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 justify-center border-l pl-6 border-gray-100 min-w-[140px]">
                {op.status === OperationStatus.SCHEDULED && (
                  <button
                    onClick={() => handleStatusUpdate(op.id, OperationStatus.IN_PROGRESS)}
                    className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium text-sm p-2 hover:bg-yellow-50 rounded transition-colors"
                  >
                    <PlayCircle size={16} /> Start Surgery
                  </button>
                )}
                {op.status === OperationStatus.IN_PROGRESS && (
                  <button
                    onClick={() => handleStatusUpdate(op.id, OperationStatus.COMPLETED)}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm p-2 hover:bg-green-50 rounded transition-colors"
                  >
                    <CheckCircle size={16} /> Complete
                  </button>
                )}
                {(op.status === OperationStatus.SCHEDULED || op.status === OperationStatus.IN_PROGRESS) && (
                  <button
                    onClick={() => handleStatusUpdate(op.id, OperationStatus.CANCELLED)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm p-2 hover:bg-red-50 rounded transition-colors"
                  >
                    <XCircle size={16} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <ScheduleSurgeryDialog
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSchedule={fetchOperations}
      />
    </div>
  );
};
