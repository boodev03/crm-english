export interface LessonDetail {
    id: string;
    created_at: Date;
    course_id: string;
    teacher_id: string;
    room_id: string;
    start_time: Date;
    end_time: Date;
    status: string; // ['Chưa diễn ra', 'Hoàn thành', 'Hủy lịch']
} 

export interface GetLessonDetailByStudentId {
    student_id: string;
    start_time: Date;
    end_time: Date;
}

export interface GetLessonDetailByTeacherId {
    teacher_id: string;
    start_time: Date;
    end_time: Date;
}