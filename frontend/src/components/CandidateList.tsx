import React, { useState, useEffect } from "react";
import DocumentViewer from "./DocumentViewer";
import "./CandidateList.css";

interface Document {
  id: number;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  documentType: string;
  uploadedAt: string;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
}

interface Experience {
  id: number;
  company: string;
  position: string;
}

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  linkedIn?: string;
  portfolio?: string;
  createdAt: string;
  educations: Education[];
  experiences: Experience[];
  documents: Document[];
}

interface CandidateListProps {
  onAddNew: () => void;
  refreshTrigger?: number;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3010";

const CandidateList: React.FC<CandidateListProps> = ({
  onAddNew,
  refreshTrigger,
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const limit = 10;

  const fetchCandidates = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/candidates?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }

      const data = await response.json();

      if (data.success) {
        setCandidates(data.data.candidates);
        setTotal(data.data.pagination.total);
        setTotalPages(data.data.pagination.totalPages);
        setCurrentPage(page);
      }
    } catch (error: any) {
      console.error("Error fetching candidates:", error);
      setError(error.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(currentPage);
  }, [refreshTrigger]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchCandidates(page);
    }
  };

  if (loading) {
    return (
      <div className="candidate-list-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-list-container">
        <div className="error-state">
          <h2>Error Loading Candidates</h2>
          <p>{error}</p>
          <button onClick={() => fetchCandidates(1)} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleViewDocuments = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseDocuments = () => {
    setSelectedCandidate(null);
  };

  return (
    <div className="candidate-list-container">
      <div className="candidate-list-header">
        <div className="header-content">
          <h1>Candidates</h1>
          <p className="candidate-count">
            {total} {total === 1 ? "candidate" : "candidates"} total
          </p>
        </div>
        <button onClick={onAddNew} className="add-candidate-button">
          <span className="button-icon">+</span>
          Add New Candidate
        </button>
      </div>

      {candidates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No Candidates Yet</h2>
          <p>Get started by adding your first candidate to the system.</p>
          <button onClick={onAddNew} className="empty-state-button">
            Add Your First Candidate
          </button>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="candidates-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Education</th>
                  <th>Experience</th>
                  <th>Documents</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <div className="candidate-name">
                        <strong>
                          {candidate.firstName} {candidate.lastName}
                        </strong>
                        {candidate.linkedIn && (
                          <a
                            href={candidate.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="linkedin-link"
                            title="LinkedIn Profile"
                          >
                            in
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <a
                        href={`mailto:${candidate.email}`}
                        className="email-link"
                      >
                        {candidate.email}
                      </a>
                    </td>
                    <td>
                      <a href={`tel:${candidate.phone}`} className="phone-link">
                        {candidate.phone}
                      </a>
                    </td>
                    <td>
                      <div className="education-summary">
                        {candidate.educations.length > 0 ? (
                          <>
                            <div className="education-item">
                              <strong>{candidate.educations[0].degree}</strong>
                              <span className="education-institution">
                                {candidate.educations[0].institution}
                              </span>
                            </div>
                            {candidate.educations.length > 1 && (
                              <span className="badge">
                                +{candidate.educations.length - 1} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="no-data">—</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="experience-summary">
                        {candidate.experiences.length > 0 ? (
                          <>
                            <div className="experience-item">
                              <strong>
                                {candidate.experiences[0].position}
                              </strong>
                              <span className="experience-company">
                                {candidate.experiences[0].company}
                              </span>
                            </div>
                            {candidate.experiences.length > 1 && (
                              <span className="badge">
                                +{candidate.experiences.length - 1} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="no-data">—</span>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      {candidate.documents.length > 0 ? (
                        <button
                          onClick={() => handleViewDocuments(candidate)}
                          className="view-docs-button"
                          title="View documents"
                        >
                          <span className="badge badge-success">
                            {candidate.documents.length} file
                            {candidate.documents.length > 1 ? "s" : ""}
                          </span>
                          <span className="view-icon">👁️</span>
                        </button>
                      ) : (
                        <span className="no-data">—</span>
                      )}
                    </td>
                    <td>{formatDate(candidate.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>

              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Document Viewer Modal */}
      {selectedCandidate && (
        <DocumentViewer
          documents={selectedCandidate.documents}
          candidateName={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
          onClose={handleCloseDocuments}
        />
      )}
    </div>
  );
};

export default CandidateList;
