export interface Course {
    id: string;
    created_at: Date;
    course_name: string;
    start_time: Date;
    end_time: Date;
    tuition: number;
    teacher_id: string;
} 

export interface ScheduleOfCourse {
    day_of_week: number; // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday 
    start_time: string; // HH:mm
    end_time: string; // HH:mm
    room_id: string;
}