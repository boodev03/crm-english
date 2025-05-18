import { supabase } from "../client";
import { LessonSubmission,LessonSubmissionWithData  } from "../dto/lesson_submission.dto";
import { ILessonSubmissionService } from "./lesson_submission.interface";

export class LessonSubmissionService implements ILessonSubmissionService {

    async getLessonSubmissionsByLessonAssignmentId(
        lessonAssignmentId: string
    ): Promise<{ data: LessonSubmissionWithData[] | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from("lesson_submissions")
                .select("*, students(*)")
                .eq("lesson_assignment_id", lessonAssignmentId);

            if (error) throw error;
            return { data: data as LessonSubmissionWithData[], error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

  async getLessonSubmissionByLessonAssignmentIdAndStudentId(
    lessonAssignmentId: string,
    studentId: string
  ): Promise<{ data: LessonSubmission | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("lesson_submissions")
        .select("*")
        .eq("lesson_assignment_id", lessonAssignmentId)
        .eq("student_id", studentId)
        .single();

      if (error) throw error;
      return { data: data as LessonSubmission, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async createLessonSubmission(
    submissionData: Omit<LessonSubmission, "id" | "created_at">
  ): Promise<{ data: LessonSubmission | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("lesson_submissions")
        .insert(submissionData)
        .select()
        .single();

      if (error) throw error;
      return { data: data as LessonSubmission, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async updateLessonSubmission(
    id: string,
    submissionData: Partial<Omit<LessonSubmission, "id" | "created_at">>
  ): Promise<{ data: LessonSubmission | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("lesson_submissions")
        .update(submissionData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as LessonSubmission, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async deleteLessonSubmission(
    id: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from("lesson_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

// Export a singleton instance
export const lessonSubmissionService = new LessonSubmissionService(); 