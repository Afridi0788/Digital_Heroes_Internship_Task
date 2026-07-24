package com.pagepulse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for the audit endpoint.
 * Contains the URL to be audited.
 */
public class AuditRequest {

    @NotNull(message = "URL is required")
    @NotBlank(message = "URL cannot be empty")
    private String url;

    public AuditRequest() {
    }

    public AuditRequest(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public static AuditRequestBuilder builder() {
        return new AuditRequestBuilder();
    }

    public static class AuditRequestBuilder {
        private String url;

        public AuditRequestBuilder url(String url) {
            this.url = url;
            return this;
        }

        public AuditRequest build() {
            return new AuditRequest(url);
        }
    }
}

