import {
  validateEmail,
  validatePhone,
  validateURL,
  validateCandidateForm,
} from "./validation";
import { CandidateFormData } from "../types/candidate.types";

describe("Validation Utilities - Unit Tests", () => {
  describe("validateEmail", () => {
    it("should accept valid email addresses", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("john.doe@company.co.uk")).toBe(true);
      expect(validateEmail("test+tag@email.com")).toBe(true);
      expect(validateEmail("user_123@test-domain.org")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("invalid@")).toBe(false);
      expect(validateEmail("@invalid.com")).toBe(false);
      expect(validateEmail("invalid@.com")).toBe(false);
      expect(validateEmail("invalid..email@test.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });
  });

  describe("validatePhone", () => {
    it("should accept valid phone numbers", () => {
      expect(validatePhone("+1234567890")).toBe(true);
      expect(validatePhone("123-456-7890")).toBe(true);
      expect(validatePhone("(123) 456-7890")).toBe(true);
      expect(validatePhone("+1 (234) 567-8900")).toBe(true);
      expect(validatePhone("1234567890")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(validatePhone("invalid")).toBe(false);
      expect(validatePhone("abc-def-ghij")).toBe(false);
      expect(validatePhone("123")).toBe(false);
      expect(validatePhone("")).toBe(false);
    });
  });

  describe("validateURL", () => {
    it("should accept valid URLs", () => {
      expect(validateURL("https://example.com")).toBe(true);
      expect(validateURL("http://test.org")).toBe(true);
      expect(validateURL("https://sub.domain.com/path")).toBe(true);
      expect(validateURL("https://linkedin.com/in/username")).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(validateURL("invalid")).toBe(false);
      expect(validateURL("not-a-url")).toBe(false);
      expect(validateURL("")).toBe(false);
    });
  });

  describe("validateCandidateForm", () => {
    const validFormData: CandidateFormData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      address: "123 Main St",
      linkedIn: "https://linkedin.com/in/johndoe",
      portfolio: "https://johndoe.com",
      educations: [],
      experiences: [],
    };

    it("should pass validation with valid data", () => {
      const errors = validateCandidateForm(validFormData);
      expect(Object.keys(errors).length).toBe(0);
    });

    describe("firstName validation", () => {
      it("should require firstName", () => {
        const data = { ...validFormData, firstName: "" };
        const errors = validateCandidateForm(data);
        expect(errors.firstName).toBeDefined();
        expect(errors.firstName).toContain("required");
      });

      it("should reject firstName less than 2 characters", () => {
        const data = { ...validFormData, firstName: "J" };
        const errors = validateCandidateForm(data);
        expect(errors.firstName).toBeDefined();
      });

      it("should reject firstName with invalid characters", () => {
        const data = { ...validFormData, firstName: "John123" };
        const errors = validateCandidateForm(data);
        expect(errors.firstName).toBeDefined();
      });

      it("should accept firstName with accents", () => {
        const data = { ...validFormData, firstName: "José" };
        const errors = validateCandidateForm(data);
        expect(errors.firstName).toBeUndefined();
      });

      it("should accept firstName with hyphens and apostrophes", () => {
        const data1 = { ...validFormData, firstName: "Jean-Paul" };
        const errors1 = validateCandidateForm(data1);
        expect(errors1.firstName).toBeUndefined();

        const data2 = { ...validFormData, firstName: "O'Brien" };
        const errors2 = validateCandidateForm(data2);
        expect(errors2.firstName).toBeUndefined();
      });
    });

    describe("lastName validation", () => {
      it("should require lastName", () => {
        const data = { ...validFormData, lastName: "" };
        const errors = validateCandidateForm(data);
        expect(errors.lastName).toBeDefined();
        expect(errors.lastName).toContain("required");
      });

      it("should reject lastName less than 2 characters", () => {
        const data = { ...validFormData, lastName: "D" };
        const errors = validateCandidateForm(data);
        expect(errors.lastName).toBeDefined();
      });
    });

    describe("email validation", () => {
      it("should require email", () => {
        const data = { ...validFormData, email: "" };
        const errors = validateCandidateForm(data);
        expect(errors.email).toBeDefined();
      });

      it("should reject invalid email format", () => {
        const data = { ...validFormData, email: "invalid-email" };
        const errors = validateCandidateForm(data);
        expect(errors.email).toBeDefined();
      });
    });

    describe("phone validation", () => {
      it("should require phone", () => {
        const data = { ...validFormData, phone: "" };
        const errors = validateCandidateForm(data);
        expect(errors.phone).toBeDefined();
      });

      it("should reject invalid phone format", () => {
        const data = { ...validFormData, phone: "invalid" };
        const errors = validateCandidateForm(data);
        expect(errors.phone).toBeDefined();
      });
    });

    describe("optional fields validation", () => {
      it("should accept empty linkedIn", () => {
        const data = { ...validFormData, linkedIn: "" };
        const errors = validateCandidateForm(data);
        expect(errors.linkedIn).toBeUndefined();
      });

      it("should reject invalid linkedIn URL when provided", () => {
        const data = { ...validFormData, linkedIn: "invalid-url" };
        const errors = validateCandidateForm(data);
        expect(errors.linkedIn).toBeDefined();
      });

      it("should accept empty portfolio", () => {
        const data = { ...validFormData, portfolio: "" };
        const errors = validateCandidateForm(data);
        expect(errors.portfolio).toBeUndefined();
      });

      it("should reject invalid portfolio URL when provided", () => {
        const data = { ...validFormData, portfolio: "invalid-url" };
        const errors = validateCandidateForm(data);
        expect(errors.portfolio).toBeDefined();
      });
    });

    describe("education validation", () => {
      it("should require institution", () => {
        const data = {
          ...validFormData,
          educations: [
            {
              institution: "",
              degree: "Bachelor",
              fieldOfStudy: "CS",
              startDate: "2015-09-01",
              endDate: "2019-06-01",
              current: false,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["education_0_institution"]).toBeDefined();
      });

      it("should require degree", () => {
        const data = {
          ...validFormData,
          educations: [
            {
              institution: "Harvard",
              degree: "",
              fieldOfStudy: "CS",
              startDate: "2015-09-01",
              endDate: "2019-06-01",
              current: false,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["education_0_degree"]).toBeDefined();
      });

      it("should require fieldOfStudy", () => {
        const data = {
          ...validFormData,
          educations: [
            {
              institution: "Harvard",
              degree: "Bachelor",
              fieldOfStudy: "",
              startDate: "2015-09-01",
              endDate: "2019-06-01",
              current: false,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["education_0_fieldOfStudy"]).toBeDefined();
      });

      it("should require startDate", () => {
        const data = {
          ...validFormData,
          educations: [
            {
              institution: "Harvard",
              degree: "Bachelor",
              fieldOfStudy: "CS",
              startDate: "",
              endDate: "2019-06-01",
              current: false,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["education_0_startDate"]).toBeDefined();
      });

      it("should require endDate when not current", () => {
        const data = {
          ...validFormData,
          educations: [
            {
              institution: "Harvard",
              degree: "Bachelor",
              fieldOfStudy: "CS",
              startDate: "2015-09-01",
              endDate: "",
              current: false,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["education_0_endDate"]).toBeDefined();
      });

      it("should not require endDate when current is true", () => {
        const data = {
          ...validFormData,
          educations: [
            {
              institution: "Harvard",
              degree: "Bachelor",
              fieldOfStudy: "CS",
              startDate: "2015-09-01",
              endDate: "",
              current: true,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["education_0_endDate"]).toBeUndefined();
      });

      it("should reject endDate before startDate", () => {
        const data = {
          ...validFormData,
          educations: [
            {
              institution: "Harvard",
              degree: "Bachelor",
              fieldOfStudy: "CS",
              startDate: "2019-09-01",
              endDate: "2015-06-01",
              current: false,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["education_0_endDate"]).toBeDefined();
        expect(errors["education_0_endDate"]).toContain("after start date");
      });
    });

    describe("experience validation", () => {
      it("should require company", () => {
        const data = {
          ...validFormData,
          experiences: [
            {
              company: "",
              position: "Engineer",
              startDate: "2019-07-01",
              endDate: "2023-12-01",
              current: false,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["experience_0_company"]).toBeDefined();
      });

      it("should require position", () => {
        const data = {
          ...validFormData,
          experiences: [
            {
              company: "Google",
              position: "",
              startDate: "2019-07-01",
              endDate: "2023-12-01",
              current: false,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["experience_0_position"]).toBeDefined();
      });

      it("should require startDate", () => {
        const data = {
          ...validFormData,
          experiences: [
            {
              company: "Google",
              position: "Engineer",
              startDate: "",
              endDate: "2023-12-01",
              current: false,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["experience_0_startDate"]).toBeDefined();
      });

      it("should require endDate when not current", () => {
        const data = {
          ...validFormData,
          experiences: [
            {
              company: "Google",
              position: "Engineer",
              startDate: "2019-07-01",
              endDate: "",
              current: false,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["experience_0_endDate"]).toBeDefined();
      });

      it("should not require endDate when current is true", () => {
        const data = {
          ...validFormData,
          experiences: [
            {
              company: "Google",
              position: "Engineer",
              startDate: "2019-07-01",
              endDate: "",
              current: true,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["experience_0_endDate"]).toBeUndefined();
      });

      it("should reject endDate before startDate", () => {
        const data = {
          ...validFormData,
          experiences: [
            {
              company: "Google",
              position: "Engineer",
              startDate: "2023-07-01",
              endDate: "2019-12-01",
              current: false,
            },
          ],
        };
        const errors = validateCandidateForm(data);
        expect(errors["experience_0_endDate"]).toBeDefined();
        expect(errors["experience_0_endDate"]).toContain("after start date");
      });
    });
  });
});
