import { useQuery } from "@tanstack/react-query";
import { courseService } from "../supabase/services/course.service";
import { Course } from "../types/courses";

export const useCourses = () => {
    // Query keys for better cache management
    const QUERY_KEYS = {
        COURSES: ["courses"],
        ALL_COURSES: ["courses", "all"],
    };

    // Get all courses query
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: QUERY_KEYS.ALL_COURSES,
        queryFn: async () => {
            const { data, error } = await courseService.getAllCourses();
            if (error) throw error;
            return data;
        },
    });

    return {
        courses: data as Course[] | undefined,
        isLoading,
        isError: error,
        refetch,
    };
};
