import { Session, User } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { create } from 'zustand';
import { supabase } from '../supabase/client';

interface AuthState {
    session: Session | null;
    user: User | null;
    setSession: (session: Session | null) => void;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    setSession: (session) => set({ session }),
    setUser: (user) => set({ user }),
}));

// Hook to initialize auth state and listen for changes
export const useInitializeAuth = () => {
    const { setSession, setUser } = useAuthStore();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user || null);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, [setSession, setUser]);
};
