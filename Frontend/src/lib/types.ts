/** Request DTO for the audit endpoint */
export interface AuditRequest {
  url: string;
}

/** Successful audit response DTO */
export interface AuditResponse {
  status: number;
  responseTime: number;
  title: string;
  metaDescription: string;
  h1Count: number;
  missingAltImages: number;
  wordCount: number;
}

/** Error response DTO */
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}

/** Audit history item for recent searches */
export interface AuditHistoryItem {
  id: number;
  url: string;
  status: number | null;
  responseTime: number | null;
  title: string | null;
  metaDescription: string | null;
  h1Count: number | null;
  missingAltImages: number | null;
  wordCount: number | null;
  error: string | null;
  createdAt: string;
}
