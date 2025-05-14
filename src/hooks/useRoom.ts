import { useQuery } from "@tanstack/react-query";
import { roomService } from "../supabase/services/room.service";
import { Room } from "../types/room";

export const useRooms = () => {
  // Query keys for better cache management
  const QUERY_KEYS = {
    ROOMS: ["rooms"],
    ALL_ROOMS: ["rooms", "all"],
  };

  // Get all rooms query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.ALL_ROOMS,
    queryFn: async () => {
      const { data, error } = await roomService.getAllRooms();
      if (error) throw error;
      return data;
    },
  });

  return {
    data: data as Room[] | undefined,
    isLoading,
    isError: error,
    refetch,
  };
};
