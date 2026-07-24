package com.pagepulse.controller;

import com.pagepulse.dto.AuditHistoryResponse;
import com.pagepulse.dto.AuditRequest;
import com.pagepulse.dto.AuditResponse;
import com.pagepulse.service.AuditService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST controller for website audit operations.
 * Exposes endpoints for auditing websites and retrieving audit history.
 */
@RestController
@RequestMapping("/api")
public class AuditController {

    private static final Logger log = LoggerFactory.getLogger(AuditController.class);

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    /**
     * Audits a website URL and returns analysis results.
     *
     * @param request The audit request containing the URL
     * @return ResponseEntity containing the audit results
     */
    @PostMapping("/audit")
    public ResponseEntity<AuditResponse> auditWebsite(@Valid @RequestBody AuditRequest request) {
        log.info("Received audit request for URL: {}", request.getUrl());
        AuditResponse response = auditService.auditWebsite(request.getUrl());
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves the recent audit history.
     *
     * @return ResponseEntity containing list of recent audits
     */
    @GetMapping("/history")
    public ResponseEntity<List<AuditHistoryResponse>> getHistory() {
        log.debug("Fetching audit history");
        List<AuditHistoryResponse> history = auditService.getRecentHistory();
        return ResponseEntity.ok(history);
    }

    /**
     * Health check endpoint.
     *
     * @return ResponseEntity with health status
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }

}
