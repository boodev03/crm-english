import { supabase } from "../client";
import { Course, ScheduleOfCourse } from "../dto/course.dto";
import { LessonDetail } from "../dto/lesson_detail.dto";
import { ICourseService } from "./course.interface";
import { lessonDetailService } from "./lesson_detail.service";
import dayjs from "dayjs";
export class CourseService implements ICourseService {
  async createScheduleOfCourse(
    courseId: string,
    schedules: ScheduleOfCourse[]
  ): Promise<{ data: LessonDetail[] | null; error: Error | null }> {
    const { data: course, error: courseError } = await this.getCourseById(
      courseId
    );
    // Kiểm tra sự tồn tại khóa học
    if (!course) {
      return {
        data: null,
        error: courseError,
      };
    }
    const lessonDetails: LessonDetail[] = [];
    // // Create schedule of course
    for (const schedule of schedules) {
      const start_time = dayjs(course.start_time);
      const end_time = dayjs(course.end_time);

      for (
        let date = start_time;
        date.isBefore(end_time) || date.isSame(end_time, "day");
        date = date.add(1, "day")
      ) {
        // Tìm ngày trùng thứ mấy trong tuần
        if (dayjs(date).day() === schedule.day_of_week) {
          // Tạo lesson detail
          const lessonDetail = {
            course_id: courseId,
            teacher_id: course.teacher_id,
            room_id: schedule.room_id,
            start_time: dayjs(date)
              .set("hour", parseInt(schedule.start_time.split(":")[0]))
              .set("minute", parseInt(schedule.start_time.split(":")[1]))
              .toDate(),
            end_time: dayjs(date)
              .set("hour", parseInt(schedule.end_time.split(":")[0]))
              .set("minute", parseInt(schedule.end_time.split(":")[1]))
              .toDate(),
            status: "Chưa diễn ra",
          };
          const { data: lessonDetailData, error: lessonDetailError } =
            await lessonDetailService.createLessonDetail(lessonDetail);
          if (lessonDetailError) {
            return {
              data: null,
              error: lessonDetailError,
            };
          }
          if (lessonDetailData) {
            lessonDetails.push(lessonDetailData);
          }
        }
      }
    }

    return { data: lessonDetails, error: null };
  }
  
  async getCourseById(
    id: string
  ): Promise<{ data: Course | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return { data: data as Course, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async createCourse(
    courseData: Omit<Course, "id" | "created_at">
  ): Promise<{ data: Course | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert(courseData)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Course, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async updateCourse(
    id: string,
    courseData: Partial<Omit<Course, "id" | "created_at">>
  ): Promise<{ data: Course | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("courses")
        .update(courseData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Course, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async deleteCourse(
    id: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

// Export a singleton instance
export const courseService = new CourseService();
