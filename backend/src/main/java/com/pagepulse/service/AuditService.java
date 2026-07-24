package com.pagepulse.service;

import com.pagepulse.dto.AuditHistoryResponse;
import com.pagepulse.dto.AuditResponse;

import java.util.List;

/**
 * Service interface for website auditing operations.
 */
public interface AuditService {

    /**
     * Audits a website URL and returns the analysis results.
     *
     * @param url The URL to audit
     * @return AuditResponse containing all audit metrics
     */
    AuditResponse auditWebsite(String url);

    /**
     * Retrieves the recent audit history.
     *
     * @return List of recent audit history entries
     */
    List<AuditHistoryResponse> getRecentHistory();

}
