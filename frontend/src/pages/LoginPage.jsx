import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Desktop Only */}
      <div className="hidden lg:flex lg:w-[55%] bg-attenda-dark text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-attenda-lime rounded-xl"></div>
            <span className="text-2xl font-bold">Attenda</span>
          </div>
          <div className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-xs mb-12">
            Modern • Simple • Reliable
          </div>
          
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Work starts<br />with presence.
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            Track attendance seamlessly with modern tools designed for today's workforce.
          </p>
        </div>

        {/* Abstract Time Visualization */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="100" y1="100" x2="100" y2="40" stroke="currentColor" strokeWidth="3" />
            <line x1="100" y1="100" x2="140" y2="100" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-attenda-bg">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-attenda-lime rounded-xl"></div>
              <span className="text-2xl font-bold text-attenda-dark">Attenda</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-attenda-dark mb-2">Welcome back</h2>
          <p className="text-attenda-muted mb-8">Sign in to continue to your workspace</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-card text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-attenda-dark mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-attenda-surface border border-attenda-border rounded-card focus:outline-none focus:ring-2 focus:ring-attenda-lime focus:border-transparent transition-all"
                placeholder="you@company.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-attenda-dark mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-attenda-surface border border-attenda-border rounded-card focus:outline-none focus:ring-2 focus:ring-attenda-lime focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-attenda-muted hover:text-attenda-dark transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-attenda-dark text-white py-3 px-4 rounded-card font-medium hover:bg-attenda-dark/90 focus:outline-none focus:ring-2 focus:ring-attenda-lime focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-attenda-muted">
            Demo: admin@attenda.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;