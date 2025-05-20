import { Course } from "../../types/courses";

export interface EnrollmentDto {
    id: string;
    created_at?: Date;
    student_id: string;
    course_id: string;
    status?: string; // ['unpaid', 'paid']
}

export interface EnrollmentWithCourse extends EnrollmentDto {
    course: Course;
}
