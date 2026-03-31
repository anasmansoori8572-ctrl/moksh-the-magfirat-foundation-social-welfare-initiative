import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/network-request-failed') {
        setError('Network error: Unable to reach Firebase. Please check your internet connection or ensure your API key is not restricted to specific domains.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first to reset password.');
      return;
    }
    setResetLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err: any) {
      console.error("Reset error:", err);
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8 md:mb-10">
          <div className="bg-primary/10 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6">
            <Lock className="text-primary" size={24} md:size={32} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-1 md:mb-2">Admin Portal</h1>
          <p className="text-sm md:text-base text-stone-500">Sign in to manage Moksh – The Magfirat Foundation</p>
        </div>

        <div className="bg-[#F5F5F0]/70 backdrop-blur-md p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] earthy-shadow border border-white/20">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl md:rounded-2xl flex items-center space-x-3 mb-6 animate-shake">
              <AlertCircle size={18} md:size={20} className="flex-shrink-0" />
              <span className="text-xs md:text-sm font-medium">{error}</span>
            </div>
          )}

          {resetSent && (
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl md:rounded-2xl flex items-center space-x-3 mb-6">
              <CheckCircle size={18} md:size={20} className="flex-shrink-0" />
              <span className="text-xs md:text-sm font-medium">Reset email sent! Check your inbox.</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-stone-400" size={18} md:size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@moksh.org"
                  className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl pl-12 md:pl-14 pr-4 md:pr-6 py-3.5 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs md:text-sm font-bold text-stone-700">Password</label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-[10px] md:text-xs font-bold text-primary hover:underline disabled:opacity-50"
                >
                  {resetLoading ? 'Sending...' : 'Forgot Password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-stone-400" size={18} md:size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl pl-12 md:pl-14 pr-4 md:pr-6 py-3.5 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-4 md:py-5 rounded-xl md:rounded-2xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center space-x-2 disabled:opacity-70 text-sm md:text-base"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} md:size={20} />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} md:size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 md:mt-8 text-stone-400 text-[10px] md:text-sm">
          Authorized personnel only. All access is logged.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
