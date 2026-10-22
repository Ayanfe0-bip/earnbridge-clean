import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  ArrowLeft,
  HandCoins,
  LoaderCircle,
  ShieldCheck,
} from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabase';

type AuthProps = {
  onClose: () => void;
};

export default function Auth({ onClose }: AuthProps) {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!supabaseConfigured || !supabase) {
      setError(
        'Supabase is not configured. Check the Vercel environment variables.'
      );
      return;
    }

    if (mode === 'signup' && name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    setBusy(true);

    try {
      if (mode === 'signup') {
        const { data, error: authError } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                full_name: name.trim(),
              },
            },
          });

        if (authError) throw authError;

        if (data.session) {
          setMessage(
            'Your account has been created and you are signed in.'
          );
        } else {
          setMessage(
            'Registration submitted. Check your email for a confirmation link if required.'
          );
        }
      } else {
        const { error: authError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (authError) throw authError;

        setMessage(
          'You are signed in successfully. Your worker dashboard is the next milestone.'
        );
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="auth-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <section className="auth-panel">
        <button
          type="button"
          className="auth-back"
          onClick={onClose}
        >
          <ArrowLeft size={16} />
          Back to EarnBridge
        </button>

        <div className="auth-brand-mark">
          <HandCoins size={26} />
        </div>

        <p className="auth-eyebrow">
          YOUR NEXT OPPORTUNITY STARTS HERE
        </p>

        <h2 id="auth-title">
          {mode === 'signup'
            ? 'Create your account'
            : 'Welcome back'}
        </h2>

        <p className="auth-subtitle">
          {mode === 'signup'
            ? 'Join EarnBridge and get ready to explore opportunities.'
            : 'Sign in to continue your EarnBridge journey.'}
        </p>

        {!supabaseConfigured && (
          <div className="auth-alert auth-error">
            Supabase is not configured. Check the Vercel environment
            variables.
          </div>
        )}

        {error && (
          <div className="auth-alert auth-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="auth-alert auth-success" role="status">
            {message}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Full name
              <input
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                required
                minLength={2}
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete={
                mode === 'signup'
                  ? 'new-password'
                  : 'current-password'
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </label>

          <button
            className="auth-submit"
            type="submit"
            disabled={busy || !supabaseConfigured}
          >
            {busy && (
              <LoaderCircle size={17} className="auth-spinner" />
            )}
            {busy
              ? 'Please wait…'
              : mode === 'signup'
                ? 'Create account'
                : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'signup'
            ? 'Already registered?'
            : 'New to EarnBridge?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup');
              setError('');
              setMessage('');
            }}
          >
            {mode === 'signup'
              ? 'Sign in'
              : 'Create an account'}
          </button>
        </p>

        <div className="auth-safety">
          <ShieldCheck size={16} />
          Never pay a registration fee to access EarnBridge.
        </div>
      </section>
    </div>
  );
}
