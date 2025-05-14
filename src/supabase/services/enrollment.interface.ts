import { EnrollmentDto } from "../dto/enrollment.dto";

export interface IEnrollmentService {
  createEnrollment(
    enrollmentData: Omit<EnrollmentDto, "id">
  ): Promise<{ data: EnrollmentDto | null; error: Error | null }>;
  updateEnrollment(
    id: string,
    enrollmentData: Partial<Omit<EnrollmentDto, "id">>
  ): Promise<{ data: EnrollmentDto | null; error: Error | null }>;
  deleteEnrollment(
    id: string
  ): Promise<{ success: boolean; error: Error | null }>;
}
