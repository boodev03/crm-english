import {
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useRooms } from "../../hooks/useRoom";
import { useTeachers } from "../../hooks/useTeacher";
import { ScheduleOfCourse } from "../../supabase/dto/course.dto";
import { courseService } from "../../supabase/services/course.service";

interface AddNewCourseProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddNewCourse({
  opened,
  onClose,
  onSuccess,
}: AddNewCourseProps) {
  const [schedules, setSchedules] = useState<ScheduleOfCourse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: rooms } = useRooms();
  const { teachers } = useTeachers();

  const form = useForm({
    initialValues: {
      course_name: "",
      start_time: null as Date | null,
      end_time: null as Date | null,
      tuition: 0,
      teacher_id: "",
    },
    validate: {
      course_name: (value) => (value ? null : "Vui lòng nhập tên khóa học"),
      start_time: (value) => (value ? null : "Vui lòng chọn ngày bắt đầu"),
      end_time: (value) => (value ? null : "Vui lòng chọn ngày kết thúc"),
      tuition: (value) => (value > 0 ? null : "Học phí phải lớn hơn 0"),
      teacher_id: (value) => (value ? null : "Vui lòng chọn giáo viên"),
    },
  });

  const scheduleForm = useForm({
    initialValues: {
      day_of_week: "1",
      start_time: "08:00",
      end_time: "10:00",
      room_id: "",
    },
    validate: {
      day_of_week: (value) =>
        +value >= 0 && +value <= 6 ? null : "Vui lòng chọn thứ trong tuần",
      start_time: (value) => (value ? null : "Vui lòng nhập giờ bắt đầu"),
      end_time: (value) => (value ? null : "Vui lòng nhập giờ kết thúc"),
      room_id: (value) => (value ? null : "Vui lòng chọn phòng học"),
    },
  });

  const handleAddSchedule = () => {
    if (scheduleForm.validate().hasErrors) return;

    const newSchedule: ScheduleOfCourse = {
      day_of_week: +scheduleForm.values.day_of_week,
      start_time: scheduleForm.values.start_time,
      end_time: scheduleForm.values.end_time,
      room_id: scheduleForm.values.room_id,
    };

    setSchedules([...schedules, newSchedule]);
    scheduleForm.reset();
  };

  const handleRemoveSchedule = (index: number) => {
    const newSchedules = [...schedules];
    newSchedules.splice(index, 1);
    setSchedules(newSchedules);
  };

  const handleSubmit = async (values: typeof form.values) => {
    console.log(values);
    if (schedules.length === 0) {
      notifications.show({
        title: "Lỗi",
        message: "Vui lòng thêm ít nhất một lịch học",
        color: "red",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create course
      const { data: courseData, error: courseError } =
        await courseService.createCourse({
          course_name: values.course_name,
          start_time: values.start_time as Date,
          end_time: values.end_time as Date,
          tuition: values.tuition,
          teacher_id: values.teacher_id,
        });

      if (courseError) {
        throw courseError;
      }

      if (courseData) {
        // Create schedules for the course
        const { error: scheduleError } =
          await courseService.createScheduleOfCourse(courseData.id, schedules);

        if (scheduleError) {
          throw scheduleError;
        }

        notifications.show({
          title: "Thành công",
          message: "Thêm khóa học thành công",
          color: "green",
        });

        form.reset();
        setSchedules([]);
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error instanceof Error ? error.message : "Không thể thêm khóa học",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const dayOptions = [
    { value: "0", label: "Chủ nhật" },
    { value: "1", label: "Thứ hai" },
    { value: "2", label: "Thứ ba" },
    { value: "3", label: "Thứ tư" },
    { value: "4", label: "Thứ năm" },
    { value: "5", label: "Thứ sáu" },
    { value: "6", label: "Thứ bảy" },
  ];

  // Room options from useRooms hook
  const roomOptions = rooms
    ? rooms.map((room) => ({
        value: room.id,
        label: room.room_name,
      }))
    : [];

  // Teacher options from useTeachers hook
  const teacherOptions = teachers
    ? teachers.map((teacher) => ({
        value: teacher.id,
        label: `${teacher.first_name} ${teacher.last_name}`,
      }))
    : [];

  // Check if form has all required data to enable submit button
  const isFormValid =
    form.values.course_name !== "" &&
    form.values.start_time !== null &&
    form.values.end_time !== null &&
    form.values.tuition > 0 &&
    form.values.teacher_id !== "" &&
    schedules.length > 0;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Thêm khóa học mới</Title>}
      size="lg"
      radius="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Tên khóa học"
            placeholder="Nhập tên khóa học"
            {...form.getInputProps("course_name")}
            required
          />

          <Group grow>
            <DateInput
              label="Ngày bắt đầu"
              placeholder="Chọn ngày bắt đầu"
              {...form.getInputProps("start_time")}
              required
              locale="vi"
            />

            <DateInput
              label="Ngày kết thúc"
              placeholder="Chọn ngày kết thúc"
              {...form.getInputProps("end_time")}
              required
              minDate={form.values.start_time || undefined}
              locale="vi"
            />
          </Group>

          <NumberInput
            label="Học phí"
            placeholder="Nhập học phí"
            {...form.getInputProps("tuition")}
            required
            min={0}
          />

          <Select
            label="Giáo viên"
            placeholder="Chọn giáo viên"
            data={teacherOptions}
            {...form.getInputProps("teacher_id")}
            required
            searchable
            nothingFoundMessage="Không tìm thấy giáo viên"
          />

          <Box mt="md">
            <Title order={4} mb="xs">
              Lịch học
            </Title>

            {schedules.length > 0 ? (
              <Stack>
                {schedules.map((schedule, index) => (
                  <Group
                    key={index}
                    p="xs"
                    style={{ border: "1px solid #eee", borderRadius: "4px" }}
                  >
                    <Text size="sm">
                      {
                        dayOptions.find(
                          (d) => d.value === schedule.day_of_week.toString()
                        )?.label
                      }{" "}
                      | {schedule.start_time} - {schedule.end_time} |{" "}
                      {
                        roomOptions.find((r) => r.value === schedule.room_id)
                          ?.label
                      }
                    </Text>
                    <Button
                      variant="subtle"
                      color="red"
                      size="xs"
                      onClick={() => handleRemoveSchedule(index)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </Group>
                ))}
              </Stack>
            ) : (
              <Text color="dimmed" size="sm" py="md">
                Chưa có lịch học nào. Vui lòng thêm ít nhất một lịch học.
              </Text>
            )}

            <Stack
              p="xs"
              mt="md"
              style={{ border: "1px solid #eee", borderRadius: "4px" }}
            >
              <Group grow>
                <Select
                  label="Thứ trong tuần"
                  placeholder="Chọn thứ"
                  data={dayOptions}
                  {...scheduleForm.getInputProps("day_of_week")}
                />

                <Select
                  label="Phòng học"
                  placeholder="Chọn phòng học"
                  data={roomOptions}
                  {...scheduleForm.getInputProps("room_id")}
                  searchable
                />
              </Group>

              <Group grow>
                <TextInput
                  label="Giờ bắt đầu"
                  placeholder="HH:MM"
                  {...scheduleForm.getInputProps("start_time")}
                />

                <TextInput
                  label="Giờ kết thúc"
                  placeholder="HH:MM"
                  {...scheduleForm.getInputProps("end_time")}
                />
              </Group>

              <Button
                leftSection={<IconPlus size={16} />}
                onClick={handleAddSchedule}
                variant="light"
                fullWidth
                mt="xs"
              >
                Thêm lịch học
              </Button>
            </Stack>
          </Box>

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!isFormValid}
            >
              Thêm khóa học
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
