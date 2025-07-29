import React, { useState } from 'react';
import { useAuth } from '../../hooks';

interface SignUpFormProps {
  onSuccess: () => void;
  onShowLogin: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onShowLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [success, setSuccess] = useState('');
  const { signUp, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess('');
    
    try {
      await signUp(email, password, username);
      setSuccess('Sign-up successful! Please check your email to confirm your account, then log in.');
      setEmail('');
      setPassword('');
      setUsername('');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white/90 rounded-xl shadow-lg p-6 flex flex-col gap-4 items-center mt-6">
      <div className="text-2xl font-heading font-bold text-neutral-700 mb-2 tracking-wide">Sign Up</div>
      
      <input
        type="text"
        placeholder="Username"
        className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200"
        value={username}
        onChange={e => setUsername(e.target.value)}
        autoComplete="username"
        aria-label="Username"
        disabled={loading}
        required
      />
      
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoComplete="email"
        aria-label="Email"
        disabled={loading}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200"
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoComplete="new-password"
        aria-label="Password"
        disabled={loading}
        required
      />
      
      <button
        type="submit"
        className="w-full py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 active:scale-100 flex items-center justify-center gap-2"
        aria-label="Sign Up"
        disabled={loading}
      >
        {loading && <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
        Sign Up
      </button>
      
      {error && <div className="w-full text-center text-error font-medium animate-shake">{error}</div>}
      {success && <div className="w-full text-center text-green-700 font-medium animate-fade-in">{success}</div>}
      
      <div className="w-full text-center mt-2">
        <button
          type="button"
          className="text-primary underline font-medium hover:text-primary/80 transition-all"
          onClick={onShowLogin}
        >
          Already have an account? Log in
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;