
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Cleanup function to remove stale auth tokens
const cleanupAuthState = () => {
  console.log('Cleaning up auth state...');
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User logged in, checking admin role...');
          // Check if user is admin - defer to prevent deadlocks
          setTimeout(async () => {
            try {
              const { data, error } = await supabase.rpc('has_role', {
                _user_id: session.user.id,
                _role: 'admin'
              });
              
              if (error) {
                console.error('Error checking admin role:', error);
                setIsAdmin(false);
              } else {
                console.log('Admin check result:', data);
                setIsAdmin(data || false);
              }
            } catch (error) {
              console.error('Error checking admin role:', error);
              setIsAdmin(false);
            }
          }, 100);
        } else {
          console.log('No user session');
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
          cleanupAuthState();
        } else {
          console.log('Initial session check:', session?.user?.id);
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        cleanupAuthState();
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
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
        toast({
          title: "Login berhasil",
          description: "Selamat datang kembali!",
        });
        
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
      
      toast({
        title: "Login gagal",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
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
      
      toast({
        title: "Registrasi berhasil",
        description: data.user?.email_confirmed_at 
          ? "Akun Anda telah dibuat! Silakan login."
          : "Akun Anda telah dibuat! Silakan cek email untuk konfirmasi.",
      });
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
      
      toast({
        title: "Registrasi gagal",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      
      // Clean up auth state first
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Sign out error:', error);
      }
      
      toast({
        title: "Logout berhasil",
        description: "Sampai jumpa lagi!",
      });
      
      // Force page refresh to ensure clean state
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Logout gagal",
        description: error.message || "Terjadi kesalahan saat logout",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
