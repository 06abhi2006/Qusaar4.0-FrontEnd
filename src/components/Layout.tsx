import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Activity, User, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f3f4f6] relative overflow-hidden">
      {/* Subtle animated mesh background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent" />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute top-40 -left-20 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[80px]"
        />
      </div>

      <nav className="relative z-10 bg-white/80 backdrop-blur-md sticky top-0 border-b border-gray-200/60 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-blue-50 rounded-lg"
              >
                <Activity className="w-6 h-6 text-blue-600" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Hospital IS</h1>
                <p className="text-[10px] font-medium text-blue-600 tracking-wider uppercase">{title}</p>
              </div>
              <button
                onClick={() => window.location.href = '/emergency'}
                className="ml-8 px-3 py-1 bg-red-50 text-red-600 text-sm font-semibold rounded-full border border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Emergency
              </button>
              <button
                onClick={() => window.location.href = '/ot'}
                className="ml-4 px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full border border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                OT
              </button>
              <button
                onClick={() => window.location.href = '/pharmacy'}
                className="ml-4 px-3 py-1 bg-teal-50 text-teal-600 text-sm font-semibold rounded-full border border-teal-200 hover:bg-teal-100 hover:text-teal-700 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                Pharmacy
              </button>
              <button
                onClick={() => window.location.href = '/lab'}
                className="ml-4 px-3 py-1 bg-purple-50 text-purple-600 text-sm font-semibold rounded-full border border-purple-200 hover:bg-purple-100 hover:text-purple-700 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Lab
              </button>
              <button
                onClick={() => window.location.href = '/radiology'}
                className="ml-4 px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full border border-blue-200 hover:bg-blue-100 hover:text-blue-700 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Radiology
              </button>
              <button
                onClick={() => window.location.href = '/insurance'}
                className="ml-4 px-3 py-1 bg-sky-50 text-sky-600 text-sm font-semibold rounded-full border border-sky-200 hover:bg-sky-100 hover:text-sky-700 transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-sky-500" />
                Insurance
              </button>
            </div>

            <div className="flex items-center space-x-6">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>

              <div className="flex items-center space-x-4 pl-6 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded-full inline-block">{user?.role}</p>
                </div>

                <div className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer ring-2 ring-transparent group-hover:ring-blue-200 transition-all">
                    {user?.name?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                  </div>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right border border-gray-100 z-50">
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center space-x-3 sm:hidden">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
