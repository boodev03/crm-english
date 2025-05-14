import { supabase } from "../client";
import {
  LessonDetail,
  GetLessonDetailByStudentId,
  GetLessonDetailByTeacherId,
} from "../dto/lesson_detail.dto";
import { ILessonDetailService } from "./lesson_detail.interface";

export class LessonDetailService implements ILessonDetailService {
  async createLessonDetail(
    lessonDetail: Omit<LessonDetail, "id" | "created_at">
  ): Promise<{ data: LessonDetail | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("lesson_details")
        .insert(lessonDetail)
        .select()
        .single();

      if (error) throw error;
      return { data: data as LessonDetail, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async getLessonDetailByStudentId(
    params: GetLessonDetailByStudentId
  ): Promise<{ data: LessonDetail[] | null; error: Error | null }> {
    try {
      const { student_id, start_time, end_time } = params;

      const startTimeISO =
        start_time instanceof Date ? start_time.toISOString() : start_time;
      const endTimeISO =
        end_time instanceof Date ? end_time.toISOString() : end_time;

      const { data: enrollments, error: enrollError } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("student_id", student_id);

      if (enrollError) throw enrollError;
      if (!enrollments || enrollments.length === 0) {
        return { data: null, error: null };
      }

      const courseIds = enrollments.map((enrollment) => enrollment.course_id);

      const { data, error } = await supabase
        .from("lesson_details")
        .select(
          `
          *,
          courses:course_id(course_name)
        `
        )
        .in("course_id", courseIds)
        .gte("start_time", startTimeISO)
        .lte("end_time", endTimeISO)
        .order("start_time", { ascending: true });

      if (error) throw error;

      return { data: data || null, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async getLessonDetailByTeacherId(
    params: GetLessonDetailByTeacherId
  ): Promise<{ data: LessonDetail[] | null; error: Error | null }> {
    try {
      const { teacher_id, start_time, end_time } = params;

      const startTimeISO =
        start_time instanceof Date ? start_time.toISOString() : start_time;
      const endTimeISO =
        end_time instanceof Date ? end_time.toISOString() : end_time;

      const { data, error } = await supabase
        .from("lesson_details")
        .select(
          `
          *,
          courses:course_id(course_name)
        `
        )
        .eq("teacher_id", teacher_id)
        .gte("start_time", startTimeISO)
        .lte("end_time", endTimeISO)
        .order("start_time", { ascending: true });

      if (error) throw error;

      return { data: data || null, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

export const lessonDetailService = new LessonDetailService();
