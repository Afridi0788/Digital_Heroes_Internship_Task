package com.pagepulse.dto;

/**
 * Response DTO containing the audit results.
 * Contains all metrics extracted from the analyzed webpage.
 */
public class AuditResponse {

    private int status;
    private long responseTime;
    private String title;
    private String metaDescription;
    private int h1Count;
    private int missingAltImages;
    private int wordCount;

    public AuditResponse() {
    }

    public AuditResponse(int status, long responseTime, String title, String metaDescription, int h1Count, int missingAltImages, int wordCount) {
        this.status = status;
        this.responseTime = responseTime;
        this.title = title;
        this.metaDescription = metaDescription;
        this.h1Count = h1Count;
        this.missingAltImages = missingAltImages;
        this.wordCount = wordCount;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public long getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(long responseTime) {
        this.responseTime = responseTime;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMetaDescription() {
        return metaDescription;
    }

    public void setMetaDescription(String metaDescription) {
        this.metaDescription = metaDescription;
    }

    public int getH1Count() {
        return h1Count;
    }

    public void setH1Count(int h1Count) {
        this.h1Count = h1Count;
    }

    public int getMissingAltImages() {
        return missingAltImages;
    }

    public void setMissingAltImages(int missingAltImages) {
        this.missingAltImages = missingAltImages;
    }

    public int getWordCount() {
        return wordCount;
    }

    public void setWordCount(int wordCount) {
        this.wordCount = wordCount;
    }

    public static AuditResponseBuilder builder() {
        return new AuditResponseBuilder();
    }

    public static class AuditResponseBuilder {
        private int status;
        private long responseTime;
        private String title;
        private String metaDescription;
        private int h1Count;
        private int missingAltImages;
        private int wordCount;

        public AuditResponseBuilder status(int status) {
            this.status = status;
            return this;
        }

        public AuditResponseBuilder responseTime(long responseTime) {
            this.responseTime = responseTime;
            return this;
        }

        public AuditResponseBuilder title(String title) {
            this.title = title;
            return this;
        }

        public AuditResponseBuilder metaDescription(String metaDescription) {
            this.metaDescription = metaDescription;
            return this;
        }

        public AuditResponseBuilder h1Count(int h1Count) {
            this.h1Count = h1Count;
            return this;
        }

        public AuditResponseBuilder missingAltImages(int missingAltImages) {
            this.missingAltImages = missingAltImages;
            return this;
        }

        public AuditResponseBuilder wordCount(int wordCount) {
            this.wordCount = wordCount;
            return this;
        }

        public AuditResponse build() {
            return new AuditResponse(status, responseTime, title, metaDescription, h1Count, missingAltImages, wordCount);
        }
    }
}

