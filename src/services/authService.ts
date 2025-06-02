
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authCleanup';

export const signInService = async (email: string, password: string) => {
  try {
    console.log('Attempting sign in for:', email);
    
    // Clean up any existing auth state
    cleanupAuthState();
    
    // Attempt to sign out any existing session
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.log('No existing session to sign out');
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    
    if (data.user && data.session) {
      console.log('Sign in successful:', data.user.id);
      
      // Force page refresh to ensure clean state
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 100);
    }
  } catch (error: any) {
    console.error('Sign in error:', error);
    
    let errorMessage = "Terjadi kesalahan saat login";
    
    if (error.message?.includes('Invalid login credentials')) {
      errorMessage = "Email atau password salah";
    } else if (error.message?.includes('Email not confirmed')) {
      errorMessage = "Email belum dikonfirmasi. Silakan cek email Anda";
    } else if (error.message?.includes('Too many requests')) {
      errorMessage = "Terlalu banyak percobaan. Silakan coba lagi nanti";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const signUpService = async (email: string, password: string, fullName: string) => {
  try {
    console.log('Attempting sign up for:', email);
    
    // Clean up any existing auth state
    cleanupAuthState();
    
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    
    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }
    
    console.log('Sign up successful:', data);
    
    return {
      user: data.user,
      session: data.session,
      needsConfirmation: !data.user?.email_confirmed_at
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    
    let errorMessage = "Terjadi kesalahan saat registrasi";
    
    if (error.message?.includes('User already registered')) {
      errorMessage = "Email sudah terdaftar. Silakan gunakan email lain atau login";
    } else if (error.message?.includes('Password should be at least')) {
      errorMessage = "Password harus minimal 6 karakter";
    } else if (error.message?.includes('Unable to validate email address')) {
      errorMessage = "Format email tidak valid";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const signOutService = async () => {
  try {
    console.log('Attempting sign out');
    
    // Clean up auth state first
    cleanupAuthState();
    
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      console.error('Sign out error:', error);
    }
    
    // Force page refresh to ensure clean state
    setTimeout(() => {
      window.location.href = '/auth';
    }, 100);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw error;
  }
};
