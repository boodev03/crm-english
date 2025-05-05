export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface ListeningExercise {
    id: string;
    audio_url: string;
    transcript: string;
    difficulty: DifficultyLevel;
    category_id: string;
    created_at: string;

    // Other fields when joined with other tables
    category?: ListeningCategory;
}

interface ListeningExerciseWithIndex extends ListeningExercise {
    index: number;
}


interface ListeningSubmission {
    id: string;
    exercise_id: string;
    user_id: string;
    submission_text: string;
    score: number;
    feedback: string;
    submitted_at: string;
}


interface ListeningCategory {
    id: string;
    type: string;
    index: number;
    created_at: string;
}

