import { useQuery } from "@tanstack/react-query";
import { studentService } from "../supabase/services/student.service";
import { Student } from "../types/student";

export const useStudents = () => {
  // Query keys for better cache management
  const QUERY_KEYS = {
    STUDENTS: ["students"],
    ALL_STUDENTS: ["students", "all"],
  };

  // Get all students query
  const {
    data: students,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.ALL_STUDENTS,
    queryFn: async () => {
      const { data, error } = await studentService.getAllStudents();
      if (error) throw error;
      return data;
    },
  });

  return {
    students: students as Student[] | undefined,
    isLoading,
    isError: error,
    refetch,
  };
};
