import { ListeningExercise, ListeningExerciseWithIndex } from "../types/listening";
import { supabase } from "./client";
import { CreateListeningExerciseDTO } from "./dto";

export async function getAllListeningExercises() {
    const { data, error } = await supabase
        .from("listening_exercises")
        .select("*, category:listening_categories(*)")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching listening exercises:", error);
        throw error;
    }

    return data.map((exercise, index) => ({
        ...exercise,
        index: index + 1
    })) as ListeningExerciseWithIndex[];
}

export async function getListeningExerciseById(id: string) {
    const { data, error } = await supabase
        .from("listening_exercises")
        .select("*, category:listening_categories(*)")
        .eq("id", id)
        .single();

    if (error) {
        console.error(`Error fetching listening exercise with id ${id}:`, error);
        throw error;
    }

    return data as ListeningExercise;
}

export async function createListeningExercise(exercise: CreateListeningExerciseDTO) {
    const { data, error } = await supabase
        .from("listening_exercises")
        .insert(exercise)
        .select()
        .single();

    if (error) {
        console.error("Error creating listening exercise:", error);
        throw error;
    }

    return data as ListeningExercise;
}

export async function updateListeningExercise(id: string, updates: Partial<Omit<ListeningExercise, "id" | "created_at">>) {
    const { data, error } = await supabase
        .from("listening_exercises")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(`Error updating listening exercise with id ${id}:`, error);
        throw error;
    }

    return data as ListeningExercise;
}

export async function deleteListeningExercise(id: string) {
    const { error } = await supabase
        .from("listening_exercises")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(`Error deleting listening exercise with id ${id}:`, error);
        throw error;
    }

    return true;
}

export async function filterListeningExercises({
    topic,
    difficulty
}: {
    topic?: string;
    difficulty?: string;
}) {
    let query = supabase.from("listening_exercises").select("*");

    if (topic) {
        query = query.eq("topic", topic);
    }

    if (difficulty) {
        query = query.eq("difficulty", difficulty);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
        console.error("Error filtering listening exercises:", error);
        throw error;
    }

    return data as ListeningExerciseWithIndex[];
}

