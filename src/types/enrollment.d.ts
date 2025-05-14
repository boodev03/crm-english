export interface Enrollment {
    id: string;
    student_id: string;
    course_id: string;
    status: string;
    created_at: Date;

    // Other fields for join
    student?: Student;
    course?: Course;
}
