import React, { useState } from "react";
import "./DocumentViewer.css";

interface Document {
  id: number;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  documentType: string;
  uploadedAt?: string;
}

interface DocumentViewerProps {
  documents: Document[];
  candidateName: string;
  onClose: () => void;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3010";

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documents,
  candidateName,
  onClose,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(
    documents.length > 0 ? documents[0] : null
  );

  // Handle Escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (fileType: string): string => {
    if (fileType.includes("pdf")) return "📄";
    if (
      fileType.includes("word") ||
      fileType.includes("document") ||
      fileType.includes("docx")
    )
      return "📝";
    return "📎";
  };

  const isPDF = (fileType: string): boolean => {
    return fileType.includes("pdf");
  };

  const getDocumentUrl = (fileName: string): string => {
    return `${API_BASE_URL}/uploads/${fileName}`;
  };

  const handleDownload = (doc: Document) => {
    const url = getDocumentUrl(doc.fileName);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (documents.length === 0) {
    return (
      <div className="document-viewer-overlay" onClick={handleBackdropClick}>
        <div className="document-viewer-modal">
          <div className="document-viewer-header">
            <h2>Documents - {candidateName}</h2>
            <button
              onClick={onClose}
              className="close-button"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="empty-documents">
            <div className="empty-icon">📭</div>
            <p>No documents uploaded for this candidate.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="document-viewer-overlay" onClick={handleBackdropClick}>
      <div className="document-viewer-modal">
        <div className="document-viewer-header">
          <h2>Documents - {candidateName}</h2>
          <button onClick={onClose} className="close-button" aria-label="Close">
            ×
          </button>
        </div>

        <div className="document-viewer-content">
          {/* Sidebar with document list */}
          <div className="document-list-sidebar">
            <h3>Files ({documents.length})</h3>
            <div className="document-list">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`document-list-item ${
                    selectedDoc?.id === doc.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="document-icon">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div className="document-info">
                    <div className="document-name" title={doc.originalName}>
                      {doc.originalName}
                    </div>
                    <div className="document-meta">
                      {formatFileSize(doc.fileSize)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main viewer area */}
          <div className="document-viewer-main">
            {selectedDoc && (
              <>
                <div className="document-header-info">
                  <div className="document-title">
                    <span className="doc-icon-large">
                      {getFileIcon(selectedDoc.fileType)}
                    </span>
                    <div>
                      <h3>{selectedDoc.originalName}</h3>
                      <p className="document-details">
                        {formatFileSize(selectedDoc.fileSize)} •{" "}
                        {selectedDoc.fileType} •{" "}
                        {formatDate(selectedDoc.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedDoc)}
                    className="download-button"
                  >
                    <span>⬇</span> Download
                  </button>
                </div>

                <div className="document-preview">
                  {isPDF(selectedDoc.fileType) ? (
                    <iframe
                      src={getDocumentUrl(selectedDoc.fileName)}
                      title={selectedDoc.originalName}
                      className="pdf-viewer"
                    />
                  ) : (
                    <div className="preview-unavailable">
                      <div className="preview-icon">
                        {getFileIcon(selectedDoc.fileType)}
                      </div>
                      <h3>Preview Not Available</h3>
                      <p>
                        Preview is only available for PDF files. This is a{" "}
                        {selectedDoc.fileType.split("/")[1]?.toUpperCase() ||
                          "document"}{" "}
                        file.
                      </p>
                      <button
                        onClick={() => handleDownload(selectedDoc)}
                        className="preview-download-button"
                      >
                        <span>⬇</span> Download to View
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
