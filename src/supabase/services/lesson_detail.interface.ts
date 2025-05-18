import {
  LessonDetail,
  GetLessonDetailByStudentId,
  GetLessonDetailByTeacherId
} from "../dto/lesson_detail.dto";

export interface ILessonDetailService {
  createLessonDetail(
    lessonDetail: Omit<LessonDetail, "id" | "created_at">
  ): Promise<{ data: LessonDetail | null; error: Error | null }>;
  getLessonDetailByStudentId(
    params: GetLessonDetailByStudentId
  ): Promise<{ data: LessonDetail[] | null; error: Error | null }>;
  getLessonDetailByTeacherId(
    params: GetLessonDetailByTeacherId
  ): Promise<{ data: LessonDetail[] | null; error: Error | null }>;
  getLessonDetailByCourseId(
    courseId: string
  ): Promise<{ data: LessonDetail[] | null; error: Error | null }>;
}
