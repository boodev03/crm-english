import { User } from '@supabase/supabase-js';
import { create } from 'zustand';


interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: Error | null;

    // Actions
    setUser: (user: User | null) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: Error | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    logout: () => set({ user: null, isAuthenticated: false, error: null }),
}));
