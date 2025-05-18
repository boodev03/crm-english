export interface LessonSubmission {
  id: number;
  created_at: Date;
  student_id: string;
  lesson_assignment_id: string;
  files?: string[];
  score?: number;
}
