package com.pagepulse.service.impl;

import com.pagepulse.config.JsoupConfig;
import com.pagepulse.dto.AuditHistoryResponse;
import com.pagepulse.dto.AuditResponse;
import com.pagepulse.entity.AuditHistory;
import com.pagepulse.exception.*;
import com.pagepulse.repository.AuditHistoryRepository;
import com.pagepulse.service.AuditService;
import com.pagepulse.util.HtmlParser;
import com.pagepulse.validation.UrlValidator;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.net.ssl.SSLException;
import java.io.IOException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the AuditService.
 * Handles website fetching, parsing, and analysis.
 */
@Service
public class AuditServiceImpl implements AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditServiceImpl.class);

    private final UrlValidator urlValidator;
    private final HtmlParser htmlParser;
    private final JsoupConfig jsoupConfig;
    private final AuditHistoryRepository historyRepository;

    public AuditServiceImpl(
            UrlValidator urlValidator,
            HtmlParser htmlParser,
            JsoupConfig jsoupConfig,
            AuditHistoryRepository historyRepository) {
        this.urlValidator = urlValidator;
        this.htmlParser = htmlParser;
        this.jsoupConfig = jsoupConfig;
        this.historyRepository = historyRepository;
    }

    @Override
    public AuditResponse auditWebsite(String url) {
        // Validate URL
        String validatedUrl = urlValidator.validateAndNormalize(url);
        log.info("Starting audit for URL: {}", validatedUrl);

        try {
            // Fetch and analyze the page
            AuditResponse response = fetchAndAnalyze(validatedUrl);

            // Save successful audit to history
            saveToHistory(validatedUrl, response, null);

            log.info("Audit completed for URL: {} - Status: {}, Response Time: {}ms",
                    validatedUrl, response.getStatus(), response.getResponseTime());

            return response;

        } catch (RuntimeException e) {
            // Save failed audit to history
            saveToHistory(validatedUrl, null, e.getMessage());
            throw e;
        }
    }

    @Override
    public List<AuditHistoryResponse> getRecentHistory() {
        return historyRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToHistoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * Fetches a webpage and analyzes its content.
     */
    private AuditResponse fetchAndAnalyze(String url) {
        long startTime = System.currentTimeMillis();

        try {
            Connection connection = Jsoup.connect(url)
                    .userAgent(jsoupConfig.getUserAgent())
                    .timeout(jsoupConfig.getTimeout())
                    .followRedirects(jsoupConfig.isFollowRedirects())
                    .maxBodySize(jsoupConfig.getMaxBodySize())
                    .ignoreHttpErrors(true)
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
                    .header("Accept-Language", "en-US,en;q=0.5");

            Connection.Response response = connection.execute();
            long responseTime = System.currentTimeMillis() - startTime;

            // Check content type
            String contentType = response.contentType();
            if (contentType != null &&
                !contentType.contains("text/html") &&
                !contentType.contains("application/xhtml+xml") &&
                !contentType.contains("text/plain")) {
                throw new UnsupportedContentTypeException(
                        "Unsupported content type: " + contentType + ". Only HTML pages can be audited.");
            }

            // Check for HTTP errors (4xx, 5xx) - we still analyze them but log a warning
            int statusCode = response.statusCode();
            if (statusCode >= 400) {
                log.warn("Target website returned HTTP error {}: {}", statusCode, url);
            }

            // Parse and analyze the document
            Document document = response.parse();
            return htmlParser.analyze(document, statusCode, responseTime);

        } catch (SocketTimeoutException e) {
            log.error("Connection timeout for URL: {}", url, e);
            throw new ConnectionTimeoutException(
                    "Connection timed out after " + jsoupConfig.getTimeout() + "ms. " +
                    "The website may be slow or unreachable.");

        } catch (UnknownHostException e) {
            log.error("Unknown host for URL: {}", url, e);
            throw new com.pagepulse.exception.UnknownHostException(
                    "Could not resolve hostname. Please check the URL and try again.");

        } catch (SSLException e) {
            log.error("SSL error for URL: {}", url, e);
            throw new SslException(
                    "SSL/TLS error encountered. The website may have an invalid or expired certificate.");

        } catch (java.net.ConnectException e) {
            log.error("Connection refused for URL: {}", url, e);
            throw new HostUnreachableException(
                    "The host is unreachable. The server may be down or blocking connections.");

        } catch (UnsupportedContentTypeException e) {
            throw e;

        } catch (IOException e) {
            log.error("IO error fetching URL: {}", url, e);
            String message = e.getMessage();

            if (message != null && message.toLowerCase().contains("reset")) {
                throw new ConnectionTimeoutException(
                        "Connection was reset by the server. Please try again later.");
            }

            throw new FetchException("Failed to fetch the webpage: " + message);
        }
    }

    /**
     * Saves an audit result to the history.
     */
    private void saveToHistory(String url, AuditResponse response, String error) {
        try {
            AuditHistory history = AuditHistory.builder()
                    .url(url)
                    .error(error)
                    .build();

            if (response != null) {
                history.setStatus(response.getStatus());
                history.setResponseTime(response.getResponseTime());
                history.setTitle(response.getTitle());
                history.setMetaDescription(response.getMetaDescription());
                history.setH1Count(response.getH1Count());
                history.setMissingAltImages(response.getMissingAltImages());
                history.setWordCount(response.getWordCount());
            }

            historyRepository.save(history);
            log.debug("Saved audit to history for URL: {}", url);

        } catch (Exception e) {
            log.error("Failed to save audit to history for URL: {}", url, e);
            // Don't fail the audit if history save fails
        }
    }

    /**
     * Maps an AuditHistory entity to AuditHistoryResponse DTO.
     */
    private AuditHistoryResponse mapToHistoryResponse(AuditHistory history) {
        return AuditHistoryResponse.builder()
                .id(history.getId())
                .url(history.getUrl())
                .status(history.getStatus())
                .responseTime(history.getResponseTime())
                .title(history.getTitle())
                .metaDescription(history.getMetaDescription())
                .h1Count(history.getH1Count())
                .missingAltImages(history.getMissingAltImages())
                .wordCount(history.getWordCount())
                .error(history.getError())
                .createdAt(history.getCreatedAt())
                .build();
    }

}
