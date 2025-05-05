import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateListeningExerciseDTO } from '../supabase/dto';
import {
    createListeningExercise,
    deleteListeningExercise,
    getAllListeningExercises,
    updateListeningExercise
} from '../supabase/listening-service';
import { ListeningExercise } from '../types/listening';

export const useListening = () => {
    const queryClient = useQueryClient();

    // Query keys for better cache management
    const QUERY_KEYS = {
        ALL_EXERCISES: ['listening-exercises'],
        EXERCISE_DETAIL: (id: string) => ['listening-exercise', id],
        FILTERED_EXERCISES: (filters: { topic?: string; difficulty?: string }) =>
            ['listening-exercises', 'filtered', filters]
    };

    // Get all listening exercises
    const allExercisesQuery = useQuery({
        queryKey: QUERY_KEYS.ALL_EXERCISES,
        queryFn: getAllListeningExercises,
    });


    // Create a new listening exercise
    const createExerciseMutation = useMutation({
        mutationFn: (newExercise: CreateListeningExerciseDTO) =>
            createListeningExercise(newExercise),
        onSuccess: (data: ListeningExercise) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_EXERCISES });
            queryClient.setQueryData(QUERY_KEYS.EXERCISE_DETAIL(data.id), data);
        },
    });

    // Update an existing listening exercise
    const updateExerciseMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<ListeningExercise, "id" | "created_at">> }) =>
            updateListeningExercise(id, updates),
        onSuccess: (updatedExercise: ListeningExercise) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_EXERCISES });
            queryClient.setQueryData(
                QUERY_KEYS.EXERCISE_DETAIL(updatedExercise.id),
                updatedExercise
            );
            queryClient.invalidateQueries({
                queryKey: ['listening-exercises', 'filtered'],
                exact: false
            });
        },
    });

    // Delete a listening exercise
    const deleteExerciseMutation = useMutation({
        mutationFn: (id: string) => deleteListeningExercise(id),
        onSuccess: (_: boolean, id: string) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_EXERCISES });
            queryClient.removeQueries({ queryKey: QUERY_KEYS.EXERCISE_DETAIL(id) });
            queryClient.invalidateQueries({
                queryKey: ['listening-exercises', 'filtered'],
                exact: false
            });
        },
    });

    return {
        exercises: allExercisesQuery.data || [],
        isLoading: allExercisesQuery.isLoading,
        isError: allExercisesQuery.isError,
        error: allExercisesQuery.error,
        createExercise: createExerciseMutation.mutate,
        isCreating: createExerciseMutation.isPending,
        updateExercise: updateExerciseMutation.mutate,
        isUpdating: updateExerciseMutation.isPending,
        deleteExercise: deleteExerciseMutation.mutate,
        isDeleting: deleteExerciseMutation.isPending
    };
};
