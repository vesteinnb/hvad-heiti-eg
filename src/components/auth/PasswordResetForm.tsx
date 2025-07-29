import React, { useState } from 'react';
import { usePasswordReset } from '../../hooks/usePasswordReset';

interface PasswordResetFormProps {
  onBackToLogin: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const { loading, error, success, sendResetEmail, clearMessages } = usePasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendResetEmail(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error || success) {
      clearMessages();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white/90 rounded-xl shadow-lg p-6 flex flex-col gap-4 items-center">
      <div className="text-2xl font-heading font-bold text-neutral-700 mb-2 tracking-wide">Reset Password</div>
      
      {!success ? (
        <>
          <div className="text-sm text-neutral-600 font-body text-center mb-2">
            Enter your email address and we'll send you a link to reset your password.
          </div>
          
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200"
            value={email}
            onChange={handleEmailChange}
            autoComplete="email"
            aria-label="Email"
            disabled={loading}
            required
          />
          
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 active:scale-100 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Send Reset Email"
            disabled={loading || !email.trim()}
          >
            {loading && <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            Send Reset Email
          </button>
        </>
      ) : (
        <div className="text-center">
          <div className="text-4xl mb-3">📧</div>
          <div className="text-green-700 font-medium text-center mb-4">{success}</div>
          <div className="text-sm text-neutral-600 font-body text-center">
            Check your email for the reset link, then return here to sign in.
          </div>
        </div>
      )}
      
      {error && <div className="w-full text-center text-error font-medium animate-shake">{error}</div>}
      
      <div className="w-full text-center mt-2">
        <button
          type="button"
          className="text-primary underline font-medium hover:text-primary/80 transition-all"
          onClick={onBackToLogin}
        >
          Back to Login
        </button>
      </div>
    </form>
  );
};

export default PasswordResetForm;