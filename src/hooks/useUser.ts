import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/auth.api';

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
    const userQuery = useQuery({
        queryKey: QUERY_KEYS.CURRENT_USER,
        queryFn: getUser,
        retry: (failureCount, error) => {
            // Don't retry if the error message is about missing auth session
            if (error.message === 'Auth session missing!') {
                return false;
            }
            return failureCount < 3;
        },
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    return {
        user: userQuery.data as User | undefined,
        isLoading: userQuery.isLoading,
        isError: userQuery.isError,
        error: userQuery.error,
        isAuthenticated: !!userQuery.data,
        refetch: userQuery.refetch,
    };
};
