import { supabase } from "../client";
import { LessonDetail } from "../dto/lesson_detail.dto";
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
}

// Export a singleton instance
export const lessonDetailService = new LessonDetailService();
