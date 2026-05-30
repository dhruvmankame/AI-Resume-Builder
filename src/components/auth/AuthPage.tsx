import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-warm the backend server (wake up Render free tier)
  useEffect(() => {
    const prewarm = async () => {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/me`, {
          method: 'GET',
          headers: { 'x-auth-token': 'prewarm' }
        });
      } catch (e) {
        // Ignore errors, we just want to trigger a hit to wake the server up
      }
    };
    prewarm();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin 
      ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/login`
      : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/register`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Authentication failed');
      }

      login(data.token, data.user, data.resume);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4 transition-colors duration-500">
      <div className="mb-8 text-center animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">AI Resume Builder</h1>
        <p className="text-gray-600 dark:text-gray-400">Build ATS-friendly LaTeX resumes in minutes.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-500 border border-gray-100 dark:border-gray-700 transform hover:scale-[1.01]">
        <div className="relative p-8">
          {/* Animated Header */}
          <div className="transition-all duration-500 transform">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm h-5 overflow-hidden">
               <span key={isLogin ? 'l' : 's'} className="inline-block animate-in fade-in slide-in-from-right duration-300">
                {isLogin ? 'Sign in to access your saved resume.' : 'Sign up to securely save your resume online.'}
               </span>
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm border border-red-100 dark:border-red-900/50 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition-all ml-1"
            >
              {isLogin ? 'Create one' : 'Log in here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}