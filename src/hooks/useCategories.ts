import { useQuery } from '@tanstack/react-query';
import {
    getAllListeningCategories
} from '../supabase/listening-categories-service';

export const useCategories = () => {

    // Query keys for better cache management
    const QUERY_KEYS = {
        ALL_CATEGORIES: ['listening-categories'],
        CATEGORY_DETAIL: (id: string) => ['listening-category', id]
    };

    // Get all listening categories
    const allCategoriesQuery = useQuery({
        queryKey: QUERY_KEYS.ALL_CATEGORIES,
        queryFn: getAllListeningCategories,
    });

    return {
        categories: allCategoriesQuery.data || [],
        isLoading: allCategoriesQuery.isLoading,
        isError: allCategoriesQuery.isError,
        error: allCategoriesQuery.error,
    };
};
