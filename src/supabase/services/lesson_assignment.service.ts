import { supabase } from "../client";
import { LessonAssignmentDto } from "../dto/lesson_assigment.dto";
import { ILessonAssignmentService } from "./lesson_assignment.interface";

export class LessonAssignmentService implements ILessonAssignmentService {
  async getLessonAssignmentById(
    id: string
  ): Promise<{ data: LessonAssignmentDto | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("lesson_assignments")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data: data as LessonAssignmentDto, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async createLessonAssignment(
    assignmentData: Omit<LessonAssignmentDto, "id" | "created_at">
  ): Promise<{ data: LessonAssignmentDto | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("lesson_assignments")
        .insert(assignmentData)
        .select()
        .single();

      if (error) throw error;
      return { data: data as LessonAssignmentDto, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async updateLessonAssignment(
    id: string,
    assignmentData: Partial<Omit<LessonAssignmentDto, "id" | "created_at">>
  ): Promise<{ data: LessonAssignmentDto | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("lesson_assignments")
        .update(assignmentData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as LessonAssignmentDto, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async deleteLessonAssignment(
    id: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from("lesson_assignments")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  async getAllLessonAssignments(): Promise<{
    data: LessonAssignmentDto[] | null;
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase
        .from("lesson_assignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data: data as LessonAssignmentDto[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async getLessonAssignmentsByLessonDetailId(
    lessonDetailId: string
  ): Promise<{ data: LessonAssignmentDto[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("lesson_assignments")
        .select("*")
        .eq("lesson_detail_id", lessonDetailId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data: data as LessonAssignmentDto[], error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

// Export a singleton instance
export const lessonAssignmentService = new LessonAssignmentService();
