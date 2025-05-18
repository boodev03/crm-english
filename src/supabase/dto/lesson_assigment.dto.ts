
export interface LessonAssignmentDto {
    id: string;
    created_at?: Date;
    lesson_detail_id: string;
    homework_name?: string;
    files?: string; // Mảng string url file => Ví dụ "['url1', 'url2']"
    due_time?: Date;
}
