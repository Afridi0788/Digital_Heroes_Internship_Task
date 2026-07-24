package com.pagepulse.util;

import com.pagepulse.dto.AuditResponse;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

/**
 * Utility component for parsing HTML documents and extracting audit metrics.
 */
@Component
public class HtmlParser {

    private static final String NO_TITLE = "No title found";
    private static final String NO_META_DESCRIPTION = "No meta description found";

    /**
     * Analyzes an HTML document and extracts audit metrics.
     *
     * @param document     The Jsoup document to analyze
     * @param statusCode   HTTP status code from the response
     * @param responseTime Response time in milliseconds
     * @return AuditResponse containing all extracted metrics
     */
    public AuditResponse analyze(Document document, int statusCode, long responseTime) {
        String title = extractTitle(document);
        String metaDescription = extractMetaDescription(document);
        int h1Count = countH1Tags(document);
        int missingAltImages = countMissingAltImages(document);
        int wordCount = countWords(document);

        return AuditResponse.builder()
                .status(statusCode)
                .responseTime(responseTime)
                .title(title)
                .metaDescription(metaDescription)
                .h1Count(h1Count)
                .missingAltImages(missingAltImages)
                .wordCount(wordCount)
                .build();
    }

    /**
     * Extracts the page title from the document.
     */
    public String extractTitle(Document document) {
        String title = document.title();
        if (title != null && !title.trim().isEmpty()) {
            return title.trim();
        }

        // Fallback: try og:title
        Element ogTitle = document.selectFirst("meta[property=og:title]");
        if (ogTitle != null) {
            String content = ogTitle.attr("content");
            if (!content.trim().isEmpty()) {
                return content.trim();
            }
        }

        return NO_TITLE;
    }

    /**
     * Extracts the meta description from the document.
     */
    public String extractMetaDescription(Document document) {
        // Try standard meta description
        Element metaDesc = document.selectFirst("meta[name=description]");
        if (metaDesc != null) {
            String content = metaDesc.attr("content");
            if (!content.trim().isEmpty()) {
                return content.trim();
            }
        }

        // Fallback: try og:description
        Element ogDesc = document.selectFirst("meta[property=og:description]");
        if (ogDesc != null) {
            String content = ogDesc.attr("content");
            if (!content.trim().isEmpty()) {
                return content.trim();
            }
        }

        // Fallback: try twitter:description
        Element twitterDesc = document.selectFirst("meta[name=twitter:description]");
        if (twitterDesc != null) {
            String content = twitterDesc.attr("content");
            if (!content.trim().isEmpty()) {
                return content.trim();
            }
        }

        return NO_META_DESCRIPTION;
    }

    /**
     * Counts the number of H1 tags in the document.
     */
    public int countH1Tags(Document document) {
        Elements h1Tags = document.select("h1");
        return h1Tags.size();
    }

    /**
     * Counts images that are missing the ALT attribute or have empty ALT.
     */
    public int countMissingAltImages(Document document) {
        Elements images = document.select("img");
        int missingAlt = 0;

        for (Element img : images) {
            String alt = img.attr("alt");
            if (alt == null || alt.trim().isEmpty()) {
                missingAlt++;
            }
        }

        return missingAlt;
    }

    /**
     * Counts the approximate number of words in visible body text.
     * Ignores script, style, and hidden elements.
     */
    public int countWords(Document document) {
        // Clone to avoid modifying original
        Document clone = document.clone();

        // Remove non-visible elements
        clone.select("script").remove();
        clone.select("style").remove();
        clone.select("noscript").remove();
        clone.select("head").remove();
        clone.select("[style*=display:none]").remove();
        clone.select("[style*=display: none]").remove();
        clone.select("[hidden]").remove();
        clone.select("meta").remove();
        clone.select("link").remove();

        // Get text from body
        Element body = clone.body();
        if (body == null) {
            return 0;
        }

        String text = body.text();
        if (text == null || text.trim().isEmpty()) {
            return 0;
        }

        // Split by whitespace and count non-empty words
        String[] words = text.trim().split("\\s+");
        int count = 0;
        for (String word : words) {
            if (!word.isEmpty()) {
                count++;
            }
        }

        return count;
    }

}
