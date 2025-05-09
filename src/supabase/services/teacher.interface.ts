import { Teacher } from "../dto/teacher.dto";


export interface ITeacherService {
    getAllTeachers(): Promise<{ data: Teacher[] | null; error: Error | null }>;
    getTeacherById(id: string): Promise<{ data: Teacher | null; error: Error | null }>;
    createTeacher(teacherData: Omit<Teacher, 'id'>): Promise<{ data: Teacher | null; error: Error | null }>;
    updateTeacher(id: string, teacherData: Partial<Omit<Teacher, 'id'>>): Promise<{ data: Teacher | null; error: Error | null }>;
    deleteTeacher(id: string): Promise<{ success: boolean; error: Error | null }>;
}
