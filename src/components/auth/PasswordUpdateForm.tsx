import React, { useState } from 'react';
import { usePasswordReset } from '../../hooks/usePasswordReset';

interface PasswordUpdateFormProps {
  onSuccess: () => void;
}

const PasswordUpdateForm: React.FC<PasswordUpdateFormProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { loading, error, success, updatePassword, clearMessages } = usePasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    await updatePassword(password);
    
    if (!error) {
      // Small delay to show success message, then redirect
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error || success) {
      clearMessages();
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (error || success) {
      clearMessages();
    }
  };

  const passwordsMatch = password === confirmPassword;
  const isValid = password.length >= 6 && passwordsMatch;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white/90 rounded-xl shadow-lg p-6 flex flex-col gap-4 items-center">
      <div className="text-2xl font-heading font-bold text-neutral-700 mb-2 tracking-wide">Update Password</div>
      
      {!success ? (
        <>
          <div className="text-sm text-neutral-600 font-body text-center mb-2">
            Enter your new password below.
          </div>
          
          <input
            type="password"
            placeholder="New Password"
            className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            aria-label="New Password"
            disabled={loading}
            required
            minLength={6}
          />
          
          <input
            type="password"
            placeholder="Confirm New Password"
            className={`w-full rounded-xl border-2 bg-white py-3 px-5 text-base font-body text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 ${
              confirmPassword && !passwordsMatch ? 'border-error' : 'border-gray-200'
            }`}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            autoComplete="new-password"
            aria-label="Confirm New Password"
            disabled={loading}
            required
            minLength={6}
          />
          
          {confirmPassword && !passwordsMatch && (
            <div className="w-full text-error text-xs">Passwords do not match</div>
          )}
          
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 active:scale-100 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Update Password"
            disabled={loading || !isValid}
          >
            {loading && <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            Update Password
          </button>
        </>
      ) : (
        <div className="text-center">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-green-700 font-medium text-center mb-2">{success}</div>
          <div className="text-sm text-neutral-600 font-body text-center">
            Redirecting to dashboard...
          </div>
        </div>
      )}
      
      {error && <div className="w-full text-center text-error font-medium animate-shake">{error}</div>}
    </form>
  );
};

export default PasswordUpdateForm;