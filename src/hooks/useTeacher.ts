import { useQuery } from "@tanstack/react-query";
import { teacherService } from "../supabase/services/teacher.service";
import { Teacher } from "../types/teacher";

export const useTeachers = () => {
  // Query keys for better cache management
  const QUERY_KEYS = {
    TEACHERS: ["teachers"],
    ALL_TEACHERS: ["teachers", "all"],
  };

  // Get all teachers query
  const {
    data: teachers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.ALL_TEACHERS,
    queryFn: async () => {
      const { data, error } = await teacherService.getAllTeachers();
      if (error) throw error;
      return data;
    },
  });

  return {
    teachers: teachers as Teacher[] | undefined,
    isLoading,
    isError: error,
    refetch,
  };
};
