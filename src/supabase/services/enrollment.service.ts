import { supabase } from "../client";
import { EnrollmentDto, EnrollmentWithCourse } from "../dto/enrollment.dto";
import { IEnrollmentService } from "./enrollment.interface";

export class EnrollmentService implements IEnrollmentService {
  async createEnrollment(
    enrollmentData: Omit<EnrollmentDto, "id">
  ): Promise<{ data: EnrollmentDto | null; error: Error | null }> {
    try {
      enrollmentData.status = "unpaid";
      const { data, error } = await supabase
        .from("enrollments")
        .insert(enrollmentData)
        .select()
        .single();

      if (error) throw error;
      return { data: data as EnrollmentDto, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async updateEnrollment(
    id: string,
    enrollmentData: Partial<Omit<EnrollmentDto, "id">>
  ): Promise<{ data: EnrollmentDto | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .update(enrollmentData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as EnrollmentDto, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async deleteEnrollment(
    id: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from("enrollments")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async getAllStudentsByCourseId(
    courseId: string
  ): Promise<{ data: EnrollmentDto[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          student:students(*)
        `)
        .eq("course_id", courseId);

      if (error) throw error;
      return { data: data as EnrollmentDto[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async getEnrollmentsByStudentId(
    studentId: string
  ): Promise<{ data: EnrollmentWithCourse[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          course:courses(*)
        `)
        .eq("student_id", studentId);

      if (error) throw error;
      return { data: data as EnrollmentWithCourse[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

export const enrollmentService = new EnrollmentService();
