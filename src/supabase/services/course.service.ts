import { supabase } from "../client";
import { Course } from "../dto/course.dto";
import { ICourseService } from "./course.interface";

export class CourseService implements ICourseService {
  async getCourseById(
    id: string
  ): Promise<{ data: Course | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return { data: data as Course, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async createCourse(
    courseData: Omit<Course, "id" | "created_at">
  ): Promise<{ data: Course | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert(courseData)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Course, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async updateCourse(
    id: string,
    courseData: Partial<Omit<Course, "id" | "created_at">>
  ): Promise<{ data: Course | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("courses")
        .update(courseData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Course, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async deleteCourse(
    id: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

// Export a singleton instance
export const courseService = new CourseService();
