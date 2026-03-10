import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set) => ({
    user: null,
    session: null,
    isInitialized: false,

    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),

    initializeAuth: async () => {
        // Check active session on load
        const { data: { session } } = await supabase.auth.getSession();
        set({ session, user: session?.user || null, isInitialized: true });

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user || null });
        });
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null });
    }
}));
