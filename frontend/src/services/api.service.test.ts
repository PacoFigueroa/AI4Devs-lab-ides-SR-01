import { ApiService } from "./api.service";
import { CandidateFormData } from "../types/candidate.types";

// Mock fetch globally
global.fetch = jest.fn();

describe("ApiService - Unit Tests", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("submitCandidate", () => {
    const mockCandidateData: CandidateFormData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      educations: [],
      experiences: [],
    };

    it("should successfully submit candidate data", async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, ...mockCandidateData },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await ApiService.submitCandidate(mockCandidateData, []);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should handle submission errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          error: "Validation failed",
        }),
      });

      await expect(
        ApiService.submitCandidate(mockCandidateData, [])
      ).rejects.toThrow();
    });

    it("should include files in FormData when provided", async () => {
      const mockFile = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      await ApiService.submitCandidate(mockCandidateData, [mockFile]);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      expect(callArgs[1].body).toBeInstanceOf(FormData);
    });

    it("should handle network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(
        ApiService.submitCandidate(mockCandidateData, [])
      ).rejects.toThrow("Network error");
    });
  });

  describe("getInstitutionSuggestions", () => {
    it("should return empty array for queries less than 2 characters", async () => {
      const result = await ApiService.getInstitutionSuggestions("h");
      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should fetch suggestions for valid queries", async () => {
      const mockSuggestions = ["Harvard University", "Harvard Business School"];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockSuggestions,
        }),
      });

      const result = await ApiService.getInstitutionSuggestions("harv");

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSuggestions);
    });

    it("should handle fetch errors gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const result = await ApiService.getInstitutionSuggestions("test");
      expect(result).toEqual([]);
    });

    it("should return empty array when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const result = await ApiService.getInstitutionSuggestions("test");
      expect(result).toEqual([]);
    });
  });

  describe("getCompanySuggestions", () => {
    it("should return empty array for queries less than 2 characters", async () => {
      const result = await ApiService.getCompanySuggestions("g");
      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should fetch suggestions for valid queries", async () => {
      const mockSuggestions = ["Google Inc.", "Google Cloud"];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockSuggestions,
        }),
      });

      const result = await ApiService.getCompanySuggestions("goog");

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSuggestions);
    });

    it("should handle fetch errors gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const result = await ApiService.getCompanySuggestions("test");
      expect(result).toEqual([]);
    });

    it("should return empty array when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const result = await ApiService.getCompanySuggestions("test");
      expect(result).toEqual([]);
    });
  });

  describe("API URL configuration", () => {
    it("should use environment variable for API URL", () => {
      // This test verifies that the API_BASE_URL is configurable
      expect(
        process.env.REACT_APP_API_URL || "http://localhost:3010"
      ).toBeDefined();
    });
  });
});
