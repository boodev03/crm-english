import { Student } from "../dto/student.dto";

export interface IStudentService {
    getStudentById(id: string): Promise<{ data: Student | null; error: Error | null }>;
    createStudent(studentData: Omit<Student, 'id'>): Promise<{ data: Student | null; error: Error | null }>;
    updateStudent(id: string, studentData: Partial<Omit<Student, 'id'>>): Promise<{ data: Student | null; error: Error | null }>;
    deleteStudent(id: string): Promise<{ success: boolean; error: Error | null }>;
    getStudentsByCourseId(courseId: string): Promise<{ data: Student[] | null; error: Error | null }>;
} 