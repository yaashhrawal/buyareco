/**
 * Sign Up Page
 * New user registration
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Lock, User, Chrome, AlertCircle, CheckCircle } from 'lucide-react';
import { useSignUp, useOAuthSignIn } from '../hooks/useAuth';
import { validatePassword } from '../utils/helpers';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const signUpMutation = useSignUp();
  const oauthMutation = useOAuthSignIn();

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0) {
      const validation = validatePassword(value);
      setPasswordError(validation.valid ? '' : validation.message || '');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePassword(password);
    if (!validation.valid) {
      setPasswordError(validation.message || 'Password does not meet requirements');
      return;
    }
    signUpMutation.mutate({ email, password, name });
  };

  const handleOAuth = (provider: 'google' | 'apple') => {
    oauthMutation.mutate(provider);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-center p-6">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <MapPin className="w-8 h-8 text-primary-400" />
          <span className="text-2xl font-bold text-gradient">BuyaReco</span>
        </Link>

        {/* Sign Up Form */}
        <div className="glass-strong rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>
          <p className="text-neutral-400 text-center mb-8">Start discovering your perfect vibes</p>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth('google')}
              disabled={oauthMutation.isPending}
              className="w-full bg-white text-neutral-900 rounded-xl py-3 px-4 font-semibold flex items-center justify-center gap-2 hover:bg-neutral-100 transition-colors disabled:opacity-50"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuth('apple')}
              disabled={oauthMutation.isPending}
              className="w-full bg-neutral-800 text-white rounded-xl py-3 px-4 font-semibold flex items-center justify-center gap-2 hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-neutral-700" />
            <span className="text-neutral-500 text-sm">or</span>
            <div className="flex-1 h-px bg-neutral-700" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={`w-full bg-neutral-800/50 border rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 ${
                    passwordError && password.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : !passwordError && password.length > 0
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-neutral-700 focus:ring-primary-500'
                  }`}
                />
                {password.length > 0 && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {passwordError ? (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                )}
              </div>
              {passwordError && password.length > 0 ? (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {passwordError}
                </p>
              ) : (
                <p className="text-xs text-neutral-500 mt-1">
                  Must contain: 8+ characters, uppercase, lowercase, and number
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={signUpMutation.isPending}
              className="btn-primary w-full disabled:opacity-50"
            >
              {signUpMutation.isPending ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-neutral-500 text-center mt-4">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-primary-400 hover:text-primary-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-400 hover:text-primary-300">
              Privacy Policy
            </Link>
          </p>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
