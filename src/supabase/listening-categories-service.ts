import { ListeningCategory } from "../types/listening";
import { supabase } from "./client";

const LISTENING_CATEGORIES_TABLE_NAME = "listening_categories";

export async function getAllListeningCategories() {
    const { data, error } = await supabase
        .from(LISTENING_CATEGORIES_TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching listening categories:", error);
        throw error;
    }

    return data as ListeningCategory[];
}

export async function getListeningCategoryById(id: string) {
    const { data, error } = await supabase
        .from(LISTENING_CATEGORIES_TABLE_NAME)
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(`Error fetching listening category with id ${id}:`, error);
        throw error;
    }

    return data as ListeningCategory;
}