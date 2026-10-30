import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GitFork, ArrowRight, Lock, Mail, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      addToast('Welcome Back', 'Signed in to FaultLens successfully.', 'success');
      navigate(redirectPath);
    } catch (err) {
      setServerError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setServerError('');
    try {
      // Google OAuth placeholder — wire up to real OAuth provider here
      // e.g. window.location.href = '/api/auth/google'
      await new Promise((r) => setTimeout(r, 800));
      addToast('Google Sign-In', 'Google OAuth integration required. Configure your OAuth provider.', 'warning');
    } catch (err) {
      setServerError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 space-bg relative">

      {/* Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-9 h-9 rounded-xl bg-[#111111] border border-[#2E2E2E] flex items-center justify-center group-hover:border-brand-primary transition-colors shadow-inner">
            <GitFork className="w-5 h-5 text-brand-primary rotate-90" />
          </div>
          <span className="font-bold tracking-tight text-lg text-white">
            FAULT<span className="text-brand-primary">LENS</span>
          </span>
        </Link>

        <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
        <p className="mt-1 text-xs text-[#888888]">Sign in to your FaultLens workspace.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-2xl p-6 sm:p-8 shadow-2xl">

          {/* Server Error */}
          {serverError && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg bg-[#111111] hover:bg-[#1A1A1A] border border-[#2E2E2E] hover:border-[#3D3D3D] text-slate-200 text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mb-5"
          >
            {googleLoading ? (
              <svg className="w-4 h-4 animate-spin text-[#888888]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>{googleLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#1F1F1F]" />
            <span className="text-[11px] text-[#555555] font-mono">or sign in with email</span>
            <div className="flex-1 h-px bg-[#1F1F1F]" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              error={errors.email}
              icon={Mail}
              autoComplete="email"
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => addToast('Password Reset', 'Connect your backend /api/auth/reset-password endpoint to enable this.', 'info')}
                  className="text-[11px] text-brand-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  error={errors.password}
                  icon={Lock}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-2.5 text-[#555555] hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                icon={ArrowRight}
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-5 pt-4 border-t border-[#1F1F1F] text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#888888]">
              <span>Don't have an account?</span>
              <Link to="/register" className="text-brand-primary hover:underline font-medium">
                Create one
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#555555] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Strict Environment Isolation Protection Active</span>
        </div>
      </div>
    </div>
  );
}
