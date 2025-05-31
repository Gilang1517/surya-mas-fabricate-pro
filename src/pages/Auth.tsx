
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { validateAuthForm, FormErrors } from '@/components/auth/AuthFormValidation';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateAuthForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      await signIn(email, password);
      // Navigation will be handled by the signIn function
    } catch (error: any) {
      console.error('Sign in failed:', error);
      setErrors({ general: 'Login gagal. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateAuthForm(email, password, fullName, true);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      await signUp(email, password, fullName);
      // Reset form after successful signup
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (error: any) {
      console.error('Sign up failed:', error);
      setErrors({ general: 'Registrasi gagal. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearError = (field: string) => {
    setErrors(prev => ({...prev, [field]: ''}));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader />
        <AuthTabs
          email={email}
          password={password}
          fullName={fullName}
          showPassword={showPassword}
          loading={loading}
          errors={errors}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onFullNameChange={setFullName}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onClearErrors={clearErrors}
          onClearError={clearError}
        />
      </div>
    </div>
  );
};

export default Auth;
