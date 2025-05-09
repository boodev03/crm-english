import { Room } from "../dto/room.dto";

export interface IRoomService {
    getAllRooms(): Promise<{ data: Room[] | null; error: Error | null }>;
    getRoomById(id: string): Promise<{ data: Room | null; error: Error | null }>;
    createRoom(roomData: Omit<Room, 'id'>): Promise<{ data: Room | null; error: Error | null }>;
    updateRoom(id: string, roomData: Partial<Omit<Room, 'id'>>): Promise<{ data: Room | null; error: Error | null }>;
    deleteRoom(id: string): Promise<{ success: boolean; error: Error | null }>;
}
