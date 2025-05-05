import { v4 as uuidv4 } from 'uuid';
import { supabase } from "./client";

export async function uploadAudioFile(file: File): Promise<string> {
    // Generate a unique file path if not provided
    const filePath = uuidv4();

    // Upload the file to the 'listening' bucket
    const { data, error } = await supabase.storage
        .from('listening')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading file:', error);
        throw error;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
        .from('listening')
        .getPublicUrl(data.path);

    return publicUrl;
}
