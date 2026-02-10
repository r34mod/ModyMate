// ================================================
// AUTH CONTEXT — GlicoHack v4
// Login · Register · Session · Profile
// Failsafe: timeout 3s · mounted guard · INITIAL_SESSION
// ================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuthContext } from './authContextDef';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  // ---- Fetch profile from DB ----
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error('fetchProfile exception:', err);
      return null;
    }
  }, []);

  // ---- Listen for auth changes ----
  useEffect(() => {
    mountedRef.current = true;
    let resolved = false;

    // FAILSAFE: Si Supabase no responde en 3s, desbloquear UI
    const failsafe = setTimeout(() => {
      if (!resolved && mountedRef.current) {
        console.warn('Auth failsafe: forcing loading=false after 3s timeout');
        resolved = true;
        setLoading(false);
      }
    }, 3000);

    // Subscribe to auth state changes (includes INITIAL_SESSION)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mountedRef.current) return;

        setSession(s);

        if (s?.user) {
          const p = await fetchProfile(s.user.id);
          if (mountedRef.current) setProfile(p);
        } else {
          setProfile(null);
        }

        // Desbloquear loading en INITIAL_SESSION o SIGNED_OUT
        if (!resolved && (event === 'INITIAL_SESSION' || event === 'SIGNED_OUT' || event === 'SIGNED_IN')) {
          resolved = true;
          if (mountedRef.current) setLoading(false);
        }

        // Siempre desbloquear en SIGNED_OUT por seguridad
        if (event === 'SIGNED_OUT' && mountedRef.current) {
          setLoading(false);
        }
      }
    );

    return () => {
      mountedRef.current = false;
      clearTimeout(failsafe);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // ---- Sign Up ----
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  // ---- Sign In ----
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  // ---- Sign Out ----
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setProfile(null);
  };

  // ---- Update Profile ----
  const updateProfile = async (updates) => {
    if (!session?.user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  // ---- Refresh Profile ----
  const refreshProfile = useCallback(async () => {
    if (!session?.user) return;
    const p = await fetchProfile(session.user.id);
    setProfile(p);
  }, [session, fetchProfile]);

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


