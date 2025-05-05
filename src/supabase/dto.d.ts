import { DifficultyLevel } from "../types/listening";

export interface CreateListeningExerciseDTO {
    audio_url: string;
    transcript: string;
    difficulty: DifficultyLevel;
    category_id: string;
}
