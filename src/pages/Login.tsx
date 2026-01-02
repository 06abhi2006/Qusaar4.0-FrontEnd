import { useState, FormEvent, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Activity, AlertCircle } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('session_expired') === 'true') {
      setSessionExpired(true);
    }

    // Redirect if already logged in (but use state-based navigation)
    if (user) {
      // Use replaceState to avoid adding to history and prevent back button issues
      window.history.replaceState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // CRITICAL: Always prevent default form submission
    e.preventDefault();
    e.stopPropagation();

    setError('');
    setLoading(true);
    setSessionExpired(false);

    try {
      // Wait for login to complete and token to be saved
      await login(email, password);

      // CRITICAL: Small delay to ensure sessionStorage is written and state is updated
      // This prevents race conditions during navigation
      await new Promise(resolve => setTimeout(resolve, 50));

      // Use replaceState instead of window.location.href to avoid full page reload
      // This preserves React state and prevents the "Session expired" error
      window.history.replaceState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(errorMessage || 'Invalid email or password');
      setLoading(false);
    }
  };

  // Handle Enter key press on inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Activity className="w-12 h-12 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Hospital IS</h1>
          </div>
          <p className="text-gray-600">Sign in to access your dashboard (Admin, Doctor, Receptionist, Cashier, Patient)</p>

        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {sessionExpired && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Session Expired</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Your session has expired. Please sign in again.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Authentication Failed</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
            <Input
              label="Email Address or Patient ID"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              autoComplete="username"
              placeholder="Email or Patient ID (e.g., PAT-2024...)"
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={loading}
            />

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  window.history.replaceState(null, '', '/signup');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
