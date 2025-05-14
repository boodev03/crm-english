import { useQuery } from "@tanstack/react-query";
import { courseService } from "../supabase/services/course.service";
import { Course } from "../types/courses";

export const useCourseById = (courseId: string) => {
    // Query keys for better cache management
    const QUERY_KEYS = {
        COURSES: ["courses"],
        COURSE_BY_ID: ["courses", "byId", courseId],
    };

    // Get course by id query
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: QUERY_KEYS.COURSE_BY_ID,
        queryFn: async () => {
            const { data, error } = await courseService.getCourseById(courseId);
            if (error) throw error;
            return data;
        },
        enabled: !!courseId, // Only run the query if courseId is provided
    });

    return {
        course: data as Course | undefined,
        isLoading,
        isError: error,
        refetch,
    };
};
