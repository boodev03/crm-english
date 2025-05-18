import { Student } from "./student.dto";
import { LessonAssignmentDto } from "./lesson_assigment.dto";

export interface LessonSubmission {
  id: number;
  created_at: Date;
  student_id: string;
  lesson_assignment_id: string;
  files?: string[];
  score?: number;
}

export interface LessonSubmissionWithData extends LessonSubmission {
  student?: Student;
  lesson_assignment?: LessonAssignmentDto;
}