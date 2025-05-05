import { useQuery } from '@tanstack/react-query';
import { getUser } from '../supabase/auth/auth.service';

interface User {
    id: string;
    email: string;
    role: string;
}

export const useUser = () => {
    // Query keys for better cache management
    const QUERY_KEYS = {
        USER: ['user'],
        CURRENT_USER: ['user', 'current'],
    };

    // Get current user query
    const { data: user, isLoading, error, refetch } = useQuery({
        queryKey: QUERY_KEYS.CURRENT_USER,
        queryFn: async () => {
            const { user, error } = await getUser();
            if (error) throw error;
            return user;
        },
    });

    return {
        user: user as User | undefined,
        isLoading,
        isError: error,
        refetch,
    };
};
