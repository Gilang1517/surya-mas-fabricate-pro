
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/contexts/AuthContext';
import { signInService, signUpService, signOutService } from '@/services/authService';
import { cleanupAuthState } from '@/utils/authCleanup';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signIn: signInService,
    signUp: signUpService,
    signOut: signOutService,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
