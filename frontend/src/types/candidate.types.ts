export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  linkedIn?: string;
  portfolio?: string;
  educations: Education[];
  experiences: Experience[];
}

export interface ValidationErrors {
  [key: string]: string;
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
