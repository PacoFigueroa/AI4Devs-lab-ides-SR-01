import { CandidateFormData, ValidationErrors } from "../types/candidate.types";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex =
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateCandidateForm = (
  data: CandidateFormData
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // First Name
  if (!data.firstName.trim()) {
    errors.firstName = "First name is required";
  } else if (data.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(data.firstName)) {
    errors.firstName = "First name contains invalid characters";
  }

  // Last Name
  if (!data.lastName.trim()) {
    errors.lastName = "Last name is required";
  } else if (data.lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(data.lastName)) {
    errors.lastName = "Last name contains invalid characters";
  }

  // Email
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please provide a valid email address";
  }

  // Phone
  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!validatePhone(data.phone)) {
    errors.phone = "Please provide a valid phone number";
  }

  // LinkedIn (optional)
  if (data.linkedIn && data.linkedIn.trim() && !validateURL(data.linkedIn)) {
    errors.linkedIn = "Please provide a valid LinkedIn URL";
  }

  // Portfolio (optional)
  if (data.portfolio && data.portfolio.trim() && !validateURL(data.portfolio)) {
    errors.portfolio = "Please provide a valid portfolio URL";
  }

  // Educations
  data.educations.forEach((edu, index) => {
    if (!edu.institution.trim()) {
      errors[`education_${index}_institution`] = "Institution name is required";
    }
    if (!edu.degree.trim()) {
      errors[`education_${index}_degree`] = "Degree is required";
    }
    if (!edu.fieldOfStudy.trim()) {
      errors[`education_${index}_fieldOfStudy`] = "Field of study is required";
    }
    if (!edu.startDate) {
      errors[`education_${index}_startDate`] = "Start date is required";
    }
    if (!edu.current && !edu.endDate) {
      errors[`education_${index}_endDate`] =
        "End date is required if not current";
    }
    if (
      edu.startDate &&
      edu.endDate &&
      new Date(edu.startDate) > new Date(edu.endDate)
    ) {
      errors[`education_${index}_endDate`] =
        "End date must be after start date";
    }
  });

  // Experiences
  data.experiences.forEach((exp, index) => {
    if (!exp.company.trim()) {
      errors[`experience_${index}_company`] = "Company name is required";
    }
    if (!exp.position.trim()) {
      errors[`experience_${index}_position`] = "Position is required";
    }
    if (!exp.startDate) {
      errors[`experience_${index}_startDate`] = "Start date is required";
    }
    if (!exp.current && !exp.endDate) {
      errors[`experience_${index}_endDate`] =
        "End date is required if not current";
    }
    if (
      exp.startDate &&
      exp.endDate &&
      new Date(exp.startDate) > new Date(exp.endDate)
    ) {
      errors[`experience_${index}_endDate`] =
        "End date must be after start date";
    }
  });

  return errors;
};
