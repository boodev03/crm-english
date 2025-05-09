import { Course } from "../dto/course.dto";

export interface ICourseService {
    getCourseById(id: string): Promise<{ data: Course | null; error: Error | null }>;
    createCourse(courseData: Omit<Course, 'id' | 'created_at'>): Promise<{ data: Course | null; error: Error | null }>;
    updateCourse(id: string, courseData: Partial<Omit<Course, 'id' | 'created_at'>>): Promise<{ data: Course | null; error: Error | null }>;
    deleteCourse(id: string): Promise<{ success: boolean; error: Error | null }>;
} 