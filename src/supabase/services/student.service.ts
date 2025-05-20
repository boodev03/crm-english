import { supabase, supabaseAdmin } from "../client";
import { Student } from "../dto/student.dto";
import { IStudentService } from "./student.interface";

export class StudentService implements IStudentService {
    async getAllStudents(): Promise<{ data: Student[] | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data: data as Student[], error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async getStudentById(id: string): Promise<{ data: Student | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return { data: data as Student, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async createStudent(studentData: Omit<Student, 'id'>): Promise<{ data: Student | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('students')
                .insert(studentData)
                .select()
                .single();

            if (error) throw error;
            return { data: data as Student, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async updateStudent(id: string, studentData: Partial<Omit<Student, 'id'>>): Promise<{ data: Student | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('students')
                .update(studentData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { data: data as Student, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async deleteStudent(id: string): Promise<{ success: boolean; error: Error | null }> {
        try {
            const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
            const { data: student } = await supabase
                .from('students')
                .select('email')
                .eq('id', id)
                .single();
            const deletedId = userList?.users.find(user => user.email === student?.email)?.id;
            if (!deletedId) throw new Error('User not found');
            const [, deleteResult] = await Promise.all([
                supabaseAdmin.auth.admin.deleteUser(deletedId),
                supabase
                    .from('students')
                    .delete()
                    .eq('id', id)
            ]);

            if (deleteResult.error) throw deleteResult.error;
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }

    async getStudentsByCourseId(courseId: string): Promise<{ data: Student[] | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('enrollments')
                .select('student:students(*)')
                .eq('course_id', courseId);

            if (error) throw error;

            const students = data.map(item => item.student);

            return { data: students as unknown as Student[], error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async getStudentByEmail(email: string): Promise<{ data: Student | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('email', email)
                .single();

            if (error) throw error;
            return { data: data as Student, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }
}

// Export a singleton instance
export const studentService = new StudentService(); 