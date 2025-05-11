import { LessonDetail } from "../dto/lesson_detail.dto";

export interface ILessonDetailService {
  createLessonDetail(
    lessonDetail: Omit<LessonDetail, "id" | "created_at">
  ): Promise<{ data: LessonDetail | null; error: Error | null }>;
}
