import { Course } from "../../types/courses";
import { CreateCourseDto, ScheduleOfCourse } from "../dto/course.dto";
import { LessonDetail } from "../dto/lesson_detail.dto";
export interface ICourseService {
  createScheduleOfCourse(
    courseId: string,
    schedules: ScheduleOfCourse[]
  ): Promise<{ data: LessonDetail[] | null; error: Error | null }>;
  getCourseById(
    id: string
  ): Promise<{ data: Course | null; error: Error | null }>;
  createCourse(
    courseData: Omit<CreateCourseDto, "id" | "created_at">
  ): Promise<{ data: Course | null; error: Error | null }>;
  updateCourse(
    id: string,
    courseData: Partial<Omit<CreateCourseDto, "id" | "created_at">>
  ): Promise<{ data: Course | null; error: Error | null }>;
  deleteCourse(id: string): Promise<{ success: boolean; error: Error | null }>;
  getCoursesByTeacherId(
    teacherId: string
  ): Promise<{ data: Course[] | null; error: Error | null }>;
}
