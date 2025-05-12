import { supabase } from "../client";
import { Room } from "../dto/room.dto";
import { IRoomService } from "./room.interface";

export class RoomService implements IRoomService {
    async getAllRooms(): Promise<{ data: Room[] | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data: data as Room[], error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async getRoomById(id: string): Promise<{ data: Room | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return { data: data as Room, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async createRoom(roomData: Omit<Room, 'id'>): Promise<{ data: Room | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .insert(roomData)
                .select()
                .single();

            if (error) throw error;
            return { data: data as Room, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async updateRoom(id: string, roomData: Partial<Omit<Room, 'id'>>): Promise<{ data: Room | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .update(roomData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { data: data as Room, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    }

    async deleteRoom(id: string): Promise<{ success: boolean; error: Error | null }> {
        try {
            const { error } = await supabase
                .from('rooms')
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
export const roomService = new RoomService();
