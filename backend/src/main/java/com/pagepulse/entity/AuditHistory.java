package com.pagepulse.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * Entity representing an audit history record.
 * Stores the results of each website audit for historical tracking.
 */
@Entity
@Table(name = "audit_history")
public class AuditHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2048)
    private String url;

    @Column
    private Integer status;

    @Column(name = "response_time")
    private Long responseTime;

    @Column(length = 1024)
    private String title;

    @Column(name = "meta_description", length = 2048)
    private String metaDescription;

    @Column(name = "h1_count")
    private Integer h1Count;

    @Column(name = "missing_alt_images")
    private Integer missingAltImages;

    @Column(name = "word_count")
    private Integer wordCount;

    @Column(length = 2048)
    private String error;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public AuditHistory() {
    }

    public AuditHistory(Long id, String url, Integer status, Long responseTime, String title, String metaDescription, Integer h1Count, Integer missingAltImages, Integer wordCount, String error, LocalDateTime createdAt) {
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

    public static AuditHistoryBuilder builder() {
        return new AuditHistoryBuilder();
    }

    public static class AuditHistoryBuilder {
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

        public AuditHistoryBuilder id(Long id) { this.id = id; return this; }
        public AuditHistoryBuilder url(String url) { this.url = url; return this; }
        public AuditHistoryBuilder status(Integer status) { this.status = status; return this; }
        public AuditHistoryBuilder responseTime(Long responseTime) { this.responseTime = responseTime; return this; }
        public AuditHistoryBuilder title(String title) { this.title = title; return this; }
        public AuditHistoryBuilder metaDescription(String metaDescription) { this.metaDescription = metaDescription; return this; }
        public AuditHistoryBuilder h1Count(Integer h1Count) { this.h1Count = h1Count; return this; }
        public AuditHistoryBuilder missingAltImages(Integer missingAltImages) { this.missingAltImages = missingAltImages; return this; }
        public AuditHistoryBuilder wordCount(Integer wordCount) { this.wordCount = wordCount; return this; }
        public AuditHistoryBuilder error(String error) { this.error = error; return this; }
        public AuditHistoryBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AuditHistory build() {
            return new AuditHistory(id, url, status, responseTime, title, metaDescription, h1Count, missingAltImages, wordCount, error, createdAt);
        }
    }
}

