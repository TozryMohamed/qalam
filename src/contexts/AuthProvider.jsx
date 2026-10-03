import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabase';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [rawProfile, setRawProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Effet 1 : session — getSession + listener
  useEffect(() => {
    let cancelled = false;

    // Charge la session initiale
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      console.log('📥 getSession:', data.session?.user?.email || 'AUCUNE');
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Écoute les changements
    const { data: sub } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('📡 onAuthStateChange:', event, session?.user?.email || 'AUCUNE');
        if (cancelled) return;
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  // ✅ Effet 2 : profil — rechargé à chaque changement d'user
  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    let cancelled = false;

    (async () => {
      console.log('👤 Fetch profile for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('📤 Profile:', data?.role || 'AUCUN', error || 'OK');

      if (cancelled) return;
      setRawProfile(data ?? null);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const profile = user ? rawProfile : null;

  const value = useMemo(
    () => ({ user, profile, loading }),
    [user, profile, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}