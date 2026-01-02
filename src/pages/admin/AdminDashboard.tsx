import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { StatCard } from '../../components/ui/StatCard';
import { Users, Calendar, UserCog, Briefcase } from 'lucide-react';
import { HospitalStats } from '../../types';
import apiClient from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<HospitalStats>({
    totalPatients: 0,
    appointmentsToday: 0,
    totalDoctors: 0,
    totalStaff: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if user is authenticated
    if (user) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hospital Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Patients"
              value={stats.totalPatients}
              icon={Users}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
            />
            <StatCard
              title="Appointments Today"
              value={stats.appointmentsToday}
              icon={Calendar}
              iconColor="text-green-600"
              iconBg="bg-green-100"
            />
            <StatCard
              title="Total Doctors"
              value={stats.totalDoctors}
              icon={UserCog}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
            />
            <StatCard
              title="Total Staff"
              value={stats.totalStaff}
              icon={Briefcase}
              iconColor="text-orange-600"
              iconBg="bg-orange-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/admin/doctors'}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <p className="font-medium text-gray-900">Manage Doctors</p>
                <p className="text-sm text-gray-600">Add, edit, or view doctor profiles</p>
              </button>
              <button
                onClick={() => window.location.href = '/admin/receptionists'}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <p className="font-medium text-gray-900">Manage Receptionists</p>
                <p className="text-sm text-gray-600">Add or view receptionists</p>
              </button>
              <button
                onClick={() => window.location.href = '/admin/cashiers'}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <p className="font-medium text-gray-900">Manage Cash Counter</p>
                <p className="text-sm text-gray-600">Add or view cashiers</p>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">System Status</span>
                <span className="font-medium text-green-600">Operational</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Database</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Last Backup</span>
                <span className="font-medium text-gray-900">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
