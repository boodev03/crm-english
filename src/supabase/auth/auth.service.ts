import { UserMetadata } from "@supabase/supabase-js";
import { supabase, supabaseAdmin } from "../client";

export const login = async ({ email, password }: { email: string, password: string }) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

export const logout = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error };
    }
};

export const register = async ({ email, password, metadata }: { email: string, password: string, metadata: UserMetadata }) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

export const getUser = async () => {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        return { user: data.user, error: null };
    } catch (error) {
        return { user: null, error };
    }
};

export const getSession = async () => {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return { session: data.session, error: null };
    } catch (error) {
        return { session: null, error };
    }
};

export const getUsers = async () => {
    try {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};
