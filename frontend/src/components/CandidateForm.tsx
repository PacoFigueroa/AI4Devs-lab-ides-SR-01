import React, { useState, useRef, useEffect } from "react";
import {
  CandidateFormData,
  Education,
  Experience,
  ValidationErrors,
} from "../types/candidate.types";
import { validateCandidateForm } from "../utils/validation";
import { ApiService } from "../services/api.service";
import "./CandidateForm.css";

const initialFormData: CandidateFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  linkedIn: "",
  portfolio: "",
  educations: [],
  experiences: [],
};

interface CandidateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CandidateFormData>(initialFormData);
  const [documents, setDocuments] = useState<File[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Autocomplete states
  const [institutionSuggestions, setInstitutionSuggestions] = useState<
    string[]
  >([]);
  const [companySuggestions, setCompanySuggestions] = useState<string[]>([]);
  const [showInstitutionSuggestions, setShowInstitutionSuggestions] = useState<
    number | null
  >(null);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState<
    number | null
  >(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleInputChange = (field: keyof CandidateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Clear error for this field after typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle blur events
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Add education
  const addEducation = () => {
    const newEducation: Education = {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setFormData((prev) => ({
      ...prev,
      educations: [...prev.educations, newEducation],
    }));
  };

  // Remove education
  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

  // Update education
  const updateEducation = (
    index: number,
    field: keyof Education,
    value: any
  ) => {
    setFormData((prev) => {
      const updatedEducations = [...prev.educations];
      updatedEducations[index] = {
        ...updatedEducations[index],
        [field]: value,
      };
      return { ...prev, educations: updatedEducations };
    });
    setTouched((prev) => ({ ...prev, [`education_${index}_${field}`]: true }));
  };

  // Fetch institution suggestions
  const fetchInstitutionSuggestions = async (query: string, index: number) => {
    if (query.length >= 2) {
      const suggestions = await ApiService.getInstitutionSuggestions(query);
      setInstitutionSuggestions(suggestions);
      setShowInstitutionSuggestions(index);
    } else {
      setInstitutionSuggestions([]);
      setShowInstitutionSuggestions(null);
    }
  };

  // Add experience
  const addExperience = () => {
    const newExperience: Experience = {
      company: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "",
      current: false,
    };
    setFormData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExperience],
    }));
  };

  // Remove experience
  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  // Update experience
  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: any
  ) => {
    setFormData((prev) => {
      const updatedExperiences = [...prev.experiences];
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value,
      };
      return { ...prev, experiences: updatedExperiences };
    });
    setTouched((prev) => ({ ...prev, [`experience_${index}_${field}`]: true }));
  };

  // Fetch company suggestions
  const fetchCompanySuggestions = async (query: string, index: number) => {
    if (query.length >= 2) {
      const suggestions = await ApiService.getCompanySuggestions(query);
      setCompanySuggestions(suggestions);
      setShowCompanySuggestions(index);
    } else {
      setCompanySuggestions([]);
      setShowCompanySuggestions(null);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((file) => {
        const isValidType =
          file.type === "application/pdf" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/msword";
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

        if (!isValidType) {
          setSubmitStatus({
            type: "error",
            message: `${file.name}: Only PDF and DOCX files are allowed`,
          });
          return false;
        }
        if (!isValidSize) {
          setSubmitStatus({
            type: "error",
            message: `${file.name}: File size must be less than 5MB`,
          });
          return false;
        }
        return true;
      });

      setDocuments((prev) => [...prev, ...validFiles].slice(0, 3)); // Max 3 files
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      const validFiles = newFiles.filter((file) => {
        const isValidType =
          file.type === "application/pdf" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/msword";
        const isValidSize = file.size <= 5 * 1024 * 1024;
        return isValidType && isValidSize;
      });

      setDocuments((prev) => [...prev, ...validFiles].slice(0, 3));
    }
  };

  // Remove file
  const removeFile = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Validate on change
  useEffect(() => {
    const validationErrors = validateCandidateForm(formData);
    setErrors(validationErrors);
  }, [formData]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setTouched(allFields);

    // Validate
    const validationErrors = validateCandidateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors in the form before submitting.",
      });
      // Scroll to first error
      const firstErrorElement = document.querySelector(".error");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await ApiService.submitCandidate(formData, documents);

      if (response.success) {
        setSubmitStatus({
          type: "success",
          message: "Candidate successfully added!",
        });

        // Reset form
        setFormData(initialFormData);
        setDocuments([]);
        setTouched({});
        setErrors({});

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Call onSuccess callback if provided
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          // Clear success message after 5 seconds if no callback
          setTimeout(() => {
            setSubmitStatus({ type: null, message: "" });
          }, 5000);
        }
      }
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message:
          error.message ||
          "An error occurred while submitting the form. Please try again.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData(initialFormData);
    setDocuments([]);
    setTouched({});
    setErrors({});
    setSubmitStatus({ type: null, message: "" });
  };

  return (
    <div className="candidate-form-container">
      <form className="candidate-form" onSubmit={handleSubmit} noValidate>
        <div className="form-header">
          <div className="form-header-content">
            <div>
              <h1>Add New Candidate</h1>
              <p>
                Fill in the candidate information below. Fields marked with *
                are required.
              </p>
            </div>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="back-button"
                disabled={isSubmitting}
              >
                ← Back to List
              </button>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {submitStatus.type && (
          <div className={`alert alert-${submitStatus.type}`} role="alert">
            <div>
              <div className="alert-title">
                {submitStatus.type === "success" ? "Success!" : "Error"}
              </div>
              <div>{submitStatus.message}</div>
            </div>
          </div>
        )}

        {/* Personal Information */}
        <section className="form-section">
          <h2 className="section-title">Personal Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name<span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                className={`form-input ${
                  errors.firstName && touched.firstName ? "error" : ""
                }`}
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                aria-required="true"
                aria-invalid={!!errors.firstName && touched.firstName}
                aria-describedby={
                  errors.firstName ? "firstName-error" : undefined
                }
              />
              {errors.firstName && touched.firstName && (
                <span
                  className="error-message"
                  id="firstName-error"
                  role="alert"
                >
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name<span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                className={`form-input ${
                  errors.lastName && touched.lastName ? "error" : ""
                }`}
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                aria-required="true"
                aria-invalid={!!errors.lastName && touched.lastName}
                aria-describedby={
                  errors.lastName ? "lastName-error" : undefined
                }
              />
              {errors.lastName && touched.lastName && (
                <span
                  className="error-message"
                  id="lastName-error"
                  role="alert"
                >
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email<span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                className={`form-input ${
                  errors.email && touched.email ? "error" : ""
                }`}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-required="true"
                aria-invalid={!!errors.email && touched.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && touched.email && (
                <span className="error-message" id="email-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number<span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                className={`form-input ${
                  errors.phone && touched.phone ? "error" : ""
                }`}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="+1234567890"
                aria-required="true"
                aria-invalid={!!errors.phone && touched.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && touched.phone && (
                <span className="error-message" id="phone-error" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="form-input"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="linkedIn" className="form-label">
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="linkedIn"
                className={`form-input ${
                  errors.linkedIn && touched.linkedIn ? "error" : ""
                }`}
                value={formData.linkedIn}
                onChange={(e) => handleInputChange("linkedIn", e.target.value)}
                onBlur={() => handleBlur("linkedIn")}
                placeholder="https://linkedin.com/in/username"
                aria-invalid={!!errors.linkedIn && touched.linkedIn}
                aria-describedby={
                  errors.linkedIn ? "linkedIn-error" : undefined
                }
              />
              {errors.linkedIn && touched.linkedIn && (
                <span
                  className="error-message"
                  id="linkedIn-error"
                  role="alert"
                >
                  {errors.linkedIn}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="portfolio" className="form-label">
                Portfolio Website
              </label>
              <input
                type="url"
                id="portfolio"
                className={`form-input ${
                  errors.portfolio && touched.portfolio ? "error" : ""
                }`}
                value={formData.portfolio}
                onChange={(e) => handleInputChange("portfolio", e.target.value)}
                onBlur={() => handleBlur("portfolio")}
                placeholder="https://yourportfolio.com"
                aria-invalid={!!errors.portfolio && touched.portfolio}
                aria-describedby={
                  errors.portfolio ? "portfolio-error" : undefined
                }
              />
              {errors.portfolio && touched.portfolio && (
                <span
                  className="error-message"
                  id="portfolio-error"
                  role="alert"
                >
                  {errors.portfolio}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="form-section">
          <h2 className="section-title">Education</h2>

          {formData.educations.map((education, index) => (
            <div key={index} className="list-item">
              <div className="list-item-header">
                <h3 className="list-item-title">Education #{index + 1}</h3>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeEducation(index)}
                  aria-label={`Remove education ${index + 1}`}
                >
                  Remove
                </button>
              </div>

              <div className="form-row">
                <div className="form-group autocomplete-wrapper">
                  <label
                    htmlFor={`institution-${index}`}
                    className="form-label"
                  >
                    Institution<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`institution-${index}`}
                    className={`form-input ${
                      errors[`education_${index}_institution`] &&
                      touched[`education_${index}_institution`]
                        ? "error"
                        : ""
                    }`}
                    value={education.institution}
                    onChange={(e) => {
                      updateEducation(index, "institution", e.target.value);
                      fetchInstitutionSuggestions(e.target.value, index);
                    }}
                    onBlur={() => {
                      handleBlur(`education_${index}_institution`);
                      setTimeout(
                        () => setShowInstitutionSuggestions(null),
                        200
                      );
                    }}
                    aria-required="true"
                  />
                  {showInstitutionSuggestions === index &&
                    institutionSuggestions.length > 0 && (
                      <div className="autocomplete-suggestions" role="listbox">
                        {institutionSuggestions.map((suggestion, i) => (
                          <div
                            key={i}
                            className="autocomplete-item"
                            onClick={() => {
                              updateEducation(index, "institution", suggestion);
                              setShowInstitutionSuggestions(null);
                            }}
                            role="option"
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  {errors[`education_${index}_institution`] &&
                    touched[`education_${index}_institution`] && (
                      <span className="error-message" role="alert">
                        {errors[`education_${index}_institution`]}
                      </span>
                    )}
                </div>

                <div className="form-group">
                  <label htmlFor={`degree-${index}`} className="form-label">
                    Degree<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`degree-${index}`}
                    className={`form-input ${
                      errors[`education_${index}_degree`] &&
                      touched[`education_${index}_degree`]
                        ? "error"
                        : ""
                    }`}
                    value={education.degree}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                    onBlur={() => handleBlur(`education_${index}_degree`)}
                    aria-required="true"
                  />
                  {errors[`education_${index}_degree`] &&
                    touched[`education_${index}_degree`] && (
                      <span className="error-message" role="alert">
                        {errors[`education_${index}_degree`]}
                      </span>
                    )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`fieldOfStudy-${index}`} className="form-label">
                  Field of Study<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id={`fieldOfStudy-${index}`}
                  className={`form-input ${
                    errors[`education_${index}_fieldOfStudy`] &&
                    touched[`education_${index}_fieldOfStudy`]
                      ? "error"
                      : ""
                  }`}
                  value={education.fieldOfStudy}
                  onChange={(e) =>
                    updateEducation(index, "fieldOfStudy", e.target.value)
                  }
                  onBlur={() => handleBlur(`education_${index}_fieldOfStudy`)}
                  aria-required="true"
                />
                {errors[`education_${index}_fieldOfStudy`] &&
                  touched[`education_${index}_fieldOfStudy`] && (
                    <span className="error-message" role="alert">
                      {errors[`education_${index}_fieldOfStudy`]}
                    </span>
                  )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`startDate-${index}`} className="form-label">
                    Start Date<span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id={`startDate-${index}`}
                    className={`form-input ${
                      errors[`education_${index}_startDate`] &&
                      touched[`education_${index}_startDate`]
                        ? "error"
                        : ""
                    }`}
                    value={education.startDate}
                    onChange={(e) =>
                      updateEducation(index, "startDate", e.target.value)
                    }
                    onBlur={() => handleBlur(`education_${index}_startDate`)}
                    aria-required="true"
                  />
                  {errors[`education_${index}_startDate`] &&
                    touched[`education_${index}_startDate`] && (
                      <span className="error-message" role="alert">
                        {errors[`education_${index}_startDate`]}
                      </span>
                    )}
                </div>

                <div className="form-group">
                  <label htmlFor={`endDate-${index}`} className="form-label">
                    End Date
                    {!education.current && <span className="required">*</span>}
                  </label>
                  <input
                    type="date"
                    id={`endDate-${index}`}
                    className={`form-input ${
                      errors[`education_${index}_endDate`] &&
                      touched[`education_${index}_endDate`]
                        ? "error"
                        : ""
                    }`}
                    value={education.endDate || ""}
                    onChange={(e) =>
                      updateEducation(index, "endDate", e.target.value)
                    }
                    onBlur={() => handleBlur(`education_${index}_endDate`)}
                    disabled={education.current}
                    aria-required={!education.current}
                  />
                  {errors[`education_${index}_endDate`] &&
                    touched[`education_${index}_endDate`] && (
                      <span className="error-message" role="alert">
                        {errors[`education_${index}_endDate`]}
                      </span>
                    )}
                </div>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id={`current-${index}`}
                  className="checkbox-input"
                  checked={education.current}
                  onChange={(e) => {
                    updateEducation(index, "current", e.target.checked);
                    if (e.target.checked) {
                      updateEducation(index, "endDate", "");
                    }
                  }}
                />
                <label htmlFor={`current-${index}`} className="checkbox-label">
                  Currently studying here
                </label>
              </div>

              <div className="form-group">
                <label htmlFor={`description-${index}`} className="form-label">
                  Description
                </label>
                <textarea
                  id={`description-${index}`}
                  className="form-textarea"
                  value={education.description || ""}
                  onChange={(e) =>
                    updateEducation(index, "description", e.target.value)
                  }
                  placeholder="Additional details about your education..."
                />
              </div>
            </div>
          ))}

          <button type="button" className="add-button" onClick={addEducation}>
            + Add Education
          </button>
        </section>

        {/* Experience */}
        <section className="form-section">
          <h2 className="section-title">Work Experience</h2>

          {formData.experiences.map((experience, index) => (
            <div key={index} className="list-item">
              <div className="list-item-header">
                <h3 className="list-item-title">Experience #{index + 1}</h3>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeExperience(index)}
                  aria-label={`Remove experience ${index + 1}`}
                >
                  Remove
                </button>
              </div>

              <div className="form-row">
                <div className="form-group autocomplete-wrapper">
                  <label htmlFor={`company-${index}`} className="form-label">
                    Company<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`company-${index}`}
                    className={`form-input ${
                      errors[`experience_${index}_company`] &&
                      touched[`experience_${index}_company`]
                        ? "error"
                        : ""
                    }`}
                    value={experience.company}
                    onChange={(e) => {
                      updateExperience(index, "company", e.target.value);
                      fetchCompanySuggestions(e.target.value, index);
                    }}
                    onBlur={() => {
                      handleBlur(`experience_${index}_company`);
                      setTimeout(() => setShowCompanySuggestions(null), 200);
                    }}
                    aria-required="true"
                  />
                  {showCompanySuggestions === index &&
                    companySuggestions.length > 0 && (
                      <div className="autocomplete-suggestions" role="listbox">
                        {companySuggestions.map((suggestion, i) => (
                          <div
                            key={i}
                            className="autocomplete-item"
                            onClick={() => {
                              updateExperience(index, "company", suggestion);
                              setShowCompanySuggestions(null);
                            }}
                            role="option"
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  {errors[`experience_${index}_company`] &&
                    touched[`experience_${index}_company`] && (
                      <span className="error-message" role="alert">
                        {errors[`experience_${index}_company`]}
                      </span>
                    )}
                </div>

                <div className="form-group">
                  <label htmlFor={`position-${index}`} className="form-label">
                    Position<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`position-${index}`}
                    className={`form-input ${
                      errors[`experience_${index}_position`] &&
                      touched[`experience_${index}_position`]
                        ? "error"
                        : ""
                    }`}
                    value={experience.position}
                    onChange={(e) =>
                      updateExperience(index, "position", e.target.value)
                    }
                    onBlur={() => handleBlur(`experience_${index}_position`)}
                    aria-required="true"
                  />
                  {errors[`experience_${index}_position`] &&
                    touched[`experience_${index}_position`] && (
                      <span className="error-message" role="alert">
                        {errors[`experience_${index}_position`]}
                      </span>
                    )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label
                    htmlFor={`exp-startDate-${index}`}
                    className="form-label"
                  >
                    Start Date<span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id={`exp-startDate-${index}`}
                    className={`form-input ${
                      errors[`experience_${index}_startDate`] &&
                      touched[`experience_${index}_startDate`]
                        ? "error"
                        : ""
                    }`}
                    value={experience.startDate}
                    onChange={(e) =>
                      updateExperience(index, "startDate", e.target.value)
                    }
                    onBlur={() => handleBlur(`experience_${index}_startDate`)}
                    aria-required="true"
                  />
                  {errors[`experience_${index}_startDate`] &&
                    touched[`experience_${index}_startDate`] && (
                      <span className="error-message" role="alert">
                        {errors[`experience_${index}_startDate`]}
                      </span>
                    )}
                </div>

                <div className="form-group">
                  <label
                    htmlFor={`exp-endDate-${index}`}
                    className="form-label"
                  >
                    End Date
                    {!experience.current && <span className="required">*</span>}
                  </label>
                  <input
                    type="date"
                    id={`exp-endDate-${index}`}
                    className={`form-input ${
                      errors[`experience_${index}_endDate`] &&
                      touched[`experience_${index}_endDate`]
                        ? "error"
                        : ""
                    }`}
                    value={experience.endDate || ""}
                    onChange={(e) =>
                      updateExperience(index, "endDate", e.target.value)
                    }
                    onBlur={() => handleBlur(`experience_${index}_endDate`)}
                    disabled={experience.current}
                    aria-required={!experience.current}
                  />
                  {errors[`experience_${index}_endDate`] &&
                    touched[`experience_${index}_endDate`] && (
                      <span className="error-message" role="alert">
                        {errors[`experience_${index}_endDate`]}
                      </span>
                    )}
                </div>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id={`exp-current-${index}`}
                  className="checkbox-input"
                  checked={experience.current}
                  onChange={(e) => {
                    updateExperience(index, "current", e.target.checked);
                    if (e.target.checked) {
                      updateExperience(index, "endDate", "");
                    }
                  }}
                />
                <label
                  htmlFor={`exp-current-${index}`}
                  className="checkbox-label"
                >
                  Currently working here
                </label>
              </div>

              <div className="form-group">
                <label
                  htmlFor={`exp-description-${index}`}
                  className="form-label"
                >
                  Description
                </label>
                <textarea
                  id={`exp-description-${index}`}
                  className="form-textarea"
                  value={experience.description || ""}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
          ))}

          <button type="button" className="add-button" onClick={addExperience}>
            + Add Experience
          </button>
        </section>

        {/* Documents */}
        <section className="form-section">
          <h2 className="section-title">Documents</h2>

          <div
            className="file-upload-area"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            aria-label="Upload documents"
          >
            <div className="upload-icon">📄</div>
            <p className="upload-text">
              Click to upload or drag and drop files here
            </p>
            <p className="upload-hint">
              PDF or DOCX (max. 5MB per file, up to 3 files)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="file-input"
              accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              multiple
              onChange={handleFileChange}
              aria-label="File input"
            />
          </div>

          {documents.length > 0 && (
            <div className="file-list">
              {documents.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <button
                    type="button"
                    className="file-remove"
                    onClick={() => removeFile(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                <span>Submitting...</span>
              </>
            ) : (
              "Submit Candidate"
            )}
          </button>
          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm;
