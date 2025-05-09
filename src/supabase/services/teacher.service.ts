import { supabase } from "../client";
import { Teacher } from "../dto/teacher.dto";
import { ITeacherService } from "./teacher.interface";

export class TeacherService implements ITeacherService {
    async getAllTeachers(): Promise<{ data: Teacher[] | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .select('*');

            if (error) throw error;
            return { data: data as Teacher[], error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async getTeacherById(id: string): Promise<{ data: Teacher | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return { data: data as Teacher, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async createTeacher(teacherData: Omit<Teacher, 'id'>): Promise<{ data: Teacher | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .insert(teacherData)
                .select()
                .single();

            if (error) throw error;
            return { data: data as Teacher, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async updateTeacher(id: string, teacherData: Partial<Omit<Teacher, 'id'>>): Promise<{ data: Teacher | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .update(teacherData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { data: data as Teacher, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async deleteTeacher(id: string): Promise<{ success: boolean; error: Error | null }> {
        try {
            const { error } = await supabase
                .from('teachers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { success: true, error: null };
        } catch (error) {
            return { success: false, error: error as Error };
        }
    }
}

// Export a singleton instance
export const teacherService = new TeacherService();
