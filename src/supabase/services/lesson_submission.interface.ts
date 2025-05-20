import { LessonSubmission } from "../dto/lesson_submission.dto";

export interface ILessonSubmissionService {
    getLessonSubmissionsByLessonAssignmentId(
        lessonAssignmentId: string
    ): Promise<{ data: LessonSubmission[] | null; error: Error | null }>;

    getLessonSubmissionByLessonAssignmentIdAndStudentId(
    lessonAssignmentId: string,
    studentId: string
  ): Promise<{ data: LessonSubmission | null; error: Error | null }>;

  createLessonSubmission(
    submissionData: Omit<LessonSubmission, "id" | "created_at">
  ): Promise<{ data: LessonSubmission | null; error: Error | null }>;
  
  updateLessonSubmission(
    id: string,
    submissionData: Partial<Omit<LessonSubmission, "id" | "created_at">>
  ): Promise<{ data: LessonSubmission | null; error: Error | null }>;
  
  deleteLessonSubmission(
    id: string
  ): Promise<{ success: boolean; error: Error | null }>;
}
