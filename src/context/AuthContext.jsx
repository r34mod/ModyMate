// ================================================
// AUTH CONTEXT — GlicoHack v3
// Login · Register · Session · Profile
// ================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuthContext } from './authContextDef';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Fetch profile from DB ----
  const fetchProfile = useCallback(async (userId) => {
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
  }, []);

  // ---- Listen for auth changes ----
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        setProfile(p);
      }
      setLoading(false);
    });

    // Subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        if (s?.user) {
          const p = await fetchProfile(s.user.id);
          setProfile(p);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
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


