import { LessonAssignmentDto } from "../dto/lesson_assigment.dto";

export interface ILessonAssignmentService {
  getLessonAssignmentById(
    id: string
  ): Promise<{ data: LessonAssignmentDto | null; error: Error | null }>;
  
  createLessonAssignment(
    assignmentData: Omit<LessonAssignmentDto, "id" | "created_at">
  ): Promise<{ data: LessonAssignmentDto | null; error: Error | null }>;
  
  updateLessonAssignment(
    id: string,
    assignmentData: Partial<Omit<LessonAssignmentDto, "id" | "created_at">>
  ): Promise<{ data: LessonAssignmentDto | null; error: Error | null }>;
  
  deleteLessonAssignment(
    id: string
  ): Promise<{ success: boolean; error: Error | null }>;
}
