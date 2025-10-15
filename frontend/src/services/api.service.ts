import { CandidateFormData, ApiResponse } from "../types/candidate.types";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3010";

export class ApiService {
  /**
   * Submit candidate data with documents
   */
  static async submitCandidate(
    candidateData: CandidateFormData,
    documents: File[]
  ): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();

      // Add candidate data as JSON string
      formData.append("candidateData", JSON.stringify(candidateData));

      // Add documents
      documents.forEach((file) => {
        formData.append("documents", file);
      });

      const response = await fetch(`${API_BASE_URL}/api/candidates`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit candidate");
      }

      return data;
    } catch (error: any) {
      console.error("Error submitting candidate:", error);
      throw error;
    }
  }

  /**
   * Get institution suggestions for autocomplete
   */
  static async getInstitutionSuggestions(query: string): Promise<string[]> {
    try {
      if (!query || query.length < 2) {
        return [];
      }

      const response = await fetch(
        `${API_BASE_URL}/api/candidates/autocomplete/institutions?query=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching institution suggestions:", error);
      return [];
    }
  }

  /**
   * Get company suggestions for autocomplete
   */
  static async getCompanySuggestions(query: string): Promise<string[]> {
    try {
      if (!query || query.length < 2) {
        return [];
      }

      const response = await fetch(
        `${API_BASE_URL}/api/candidates/autocomplete/companies?query=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching company suggestions:", error);
      return [];
    }
  }
}
