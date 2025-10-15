export interface EducationInput {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface ExperienceInput {
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface CandidateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  linkedIn?: string;
  portfolio?: string;
  educations: EducationInput[];
  experiences: ExperienceInput[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

