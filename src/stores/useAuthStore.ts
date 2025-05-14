import { Session, User } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { create } from 'zustand';
import { supabase } from '../supabase/client';

interface AuthState {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    setSession: (session: Session | null) => void;
    setUser: (user: User | null) => void;
    setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    isLoading: true,
    setSession: (session) => set({ session }),
    setUser: (user) => set({ user }),
    setLoading: (isLoading) => set({ isLoading }),
}));

// Hook to initialize auth state and listen for changes
export const useInitializeAuth = () => {
    const { setSession, setUser, setLoading } = useAuthStore();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Get initial session
                const session = await supabase.auth.getSession();
                setSession(session.data.session);
                setUser(session.data.session?.user || null);
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                setSession(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, [setSession, setUser, setLoading]);
};
