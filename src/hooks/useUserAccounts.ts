import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../supabase/auth/auth.service";

export const useUserAccounts = () => {
    // Query keys for better cache management
    const QUERY_KEYS = {
        USER_ACCOUNTS: ["userAccounts"],
        ALL_USER_ACCOUNTS: ["userAccounts", "all"],
    };

    // Get all user accounts query
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: QUERY_KEYS.ALL_USER_ACCOUNTS,
        queryFn: async () => {
            const { data, error } = await getUsers();
            if (error) throw error;
            return data;
        },
    });

    return {
        userAccounts: data?.users || [],
        isLoading,
        isError: error,
        refetch,
    };
};
