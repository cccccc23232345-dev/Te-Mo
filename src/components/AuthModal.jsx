import React, { useEffect, useRef, useState } from 'react';
import { hasSupabaseConfig, supabase, supabaseConfigWarning } from '../supabaseClient';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, onUserLogin, onOpenLegal }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) emailInputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!hasSupabaseConfig || !supabase) {
      setErrorMsg(supabaseConfigWarning);
      return;
    }

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setSuccessMsg('Check your email for the confirmation link before signing in.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
      return;
    }

    onUserLogin(data.user);
    onClose();
  };

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" aria-describedby={errorMsg ? 'auth-modal-error' : undefined}>
        <h2 id="auth-modal-title">{isSignUp ? 'Create TeMo Account' : 'Welcome Back to TeMo'}</h2>
        {errorMsg && <p id="auth-modal-error" className="error-text" role="alert">{errorMsg}</p>}
        {successMsg && <p className="success-text" role="status">{successMsg}</p>}

        <form onSubmit={handleAuth}>
          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            ref={emailInputRef}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
          />
          {isSignUp && (
            <label className="consent-label" htmlFor="auth-consent">
              <input id="auth-consent" type="checkbox" required />
              <span>I agree to the <button type="button" onClick={() => onOpenLegal('terms')}>Terms and Conditions</button> and acknowledge the <button type="button" onClick={() => onOpenLegal('privacy')}>Privacy Policy</button>.</span>
            </label>
          )}
          <button type="submit" className="auth-submit-btn">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="toggle-auth">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" className="toggle-auth-button" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <button className="close-btn" type="button" onClick={onClose} aria-label="Close sign in dialog">✕</button>
      </div>
    </div>
  );
}