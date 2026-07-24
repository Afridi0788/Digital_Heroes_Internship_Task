package com.pagepulse.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

/**
 * Response DTO for audit history items.
 */
public class AuditHistoryResponse {

    private Long id;
    private String url;
    private Integer status;
    private Long responseTime;
    private String title;
    private String metaDescription;
    private Integer h1Count;
    private Integer missingAltImages;
    private Integer wordCount;
    private String error;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime createdAt;

    public AuditHistoryResponse() {
    }

    public AuditHistoryResponse(Long id, String url, Integer status, Long responseTime, String title, String metaDescription, Integer h1Count, Integer missingAltImages, Integer wordCount, String error, LocalDateTime createdAt) {
        this.id = id;
        this.url = url;
        this.status = status;
        this.responseTime = responseTime;
        this.title = title;
        this.metaDescription = metaDescription;
        this.h1Count = h1Count;
        this.missingAltImages = missingAltImages;
        this.wordCount = wordCount;
        this.error = error;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }

    public Long getResponseTime() { return responseTime; }
    public void setResponseTime(Long responseTime) { this.responseTime = responseTime; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMetaDescription() { return metaDescription; }
    public void setMetaDescription(String metaDescription) { this.metaDescription = metaDescription; }

    public Integer getH1Count() { return h1Count; }
    public void setH1Count(Integer h1Count) { this.h1Count = h1Count; }

    public Integer getMissingAltImages() { return missingAltImages; }
    public void setMissingAltImages(Integer missingAltImages) { this.missingAltImages = missingAltImages; }

    public Integer getWordCount() { return wordCount; }
    public void setWordCount(Integer wordCount) { this.wordCount = wordCount; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static AuditHistoryResponseBuilder builder() {
        return new AuditHistoryResponseBuilder();
    }

    public static class AuditHistoryResponseBuilder {
        private Long id;
        private String url;
        private Integer status;
        private Long responseTime;
        private String title;
        private String metaDescription;
        private Integer h1Count;
        private Integer missingAltImages;
        private Integer wordCount;
        private String error;
        private LocalDateTime createdAt;

        public AuditHistoryResponseBuilder id(Long id) { this.id = id; return this; }
        public AuditHistoryResponseBuilder url(String url) { this.url = url; return this; }
        public AuditHistoryResponseBuilder status(Integer status) { this.status = status; return this; }
        public AuditHistoryResponseBuilder responseTime(Long responseTime) { this.responseTime = responseTime; return this; }
        public AuditHistoryResponseBuilder title(String title) { this.title = title; return this; }
        public AuditHistoryResponseBuilder metaDescription(String metaDescription) { this.metaDescription = metaDescription; return this; }
        public AuditHistoryResponseBuilder h1Count(Integer h1Count) { this.h1Count = h1Count; return this; }
        public AuditHistoryResponseBuilder missingAltImages(Integer missingAltImages) { this.missingAltImages = missingAltImages; return this; }
        public AuditHistoryResponseBuilder wordCount(Integer wordCount) { this.wordCount = wordCount; return this; }
        public AuditHistoryResponseBuilder error(String error) { this.error = error; return this; }
        public AuditHistoryResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AuditHistoryResponse build() {
            return new AuditHistoryResponse(id, url, status, responseTime, title, metaDescription, h1Count, missingAltImages, wordCount, error, createdAt);
        }
    }
}

