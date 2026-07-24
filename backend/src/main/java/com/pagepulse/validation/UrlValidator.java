package com.pagepulse.validation;

import com.pagepulse.exception.InvalidUrlException;
import com.pagepulse.exception.MalformedUrlException;
import org.springframework.stereotype.Component;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Set;

/**
 * Utility component for URL validation.
 * Validates URLs for proper format and supported protocols.
 */
@Component
public class UrlValidator {

    private static final Set<String> SUPPORTED_PROTOCOLS = Set.of("http", "https");

    /**
     * Validates and normalizes the given URL.
     *
     * @param url The URL to validate
     * @return The validated and normalized URL
     * @throws InvalidUrlException if the URL is null, empty, or uses unsupported protocol
     * @throws MalformedUrlException if the URL is malformed
     */
    public String validateAndNormalize(String url) {
        if (url == null) {
            throw new InvalidUrlException("URL is required");
        }

        String trimmed = url.trim();

        if (trimmed.isEmpty()) {
            throw new InvalidUrlException("URL cannot be empty");
        }

        // Add https:// if no protocol specified
        if (!trimmed.toLowerCase().startsWith("http://") &&
            !trimmed.toLowerCase().startsWith("https://")) {
            if (trimmed.contains("://")) {
                String protocol = trimmed.substring(0, trimmed.indexOf("://")).toLowerCase();
                throw new InvalidUrlException(
                        "Only HTTP and HTTPS protocols are supported. Received: " + protocol);
            }
            trimmed = "https://" + trimmed;
        }

        URL parsedUrl;
        try {
            URI uri = new URI(trimmed);
            parsedUrl = uri.toURL();
        } catch (URISyntaxException | MalformedURLException e) {
            throw new MalformedUrlException(
                    "Please provide a valid URL (e.g., https://example.com)", e);
        }

        String protocol = parsedUrl.getProtocol().toLowerCase();
        if (!SUPPORTED_PROTOCOLS.contains(protocol)) {
            throw new InvalidUrlException(
                    "Only HTTP and HTTPS protocols are supported. Received: " + protocol);
        }

        String host = parsedUrl.getHost();
        if (host == null || host.isEmpty()) {
            throw new InvalidUrlException("URL must include a valid hostname");
        }

        // Basic hostname validation
        if (!host.contains(".") && !host.equals("localhost")) {
            throw new InvalidUrlException(
                    "Please enter a valid domain (e.g., example.com)");
        }

        return trimmed;
    }

    /**
     * Quick check if URL is valid without throwing exceptions.
     *
     * @param url The URL to check
     * @return true if valid, false otherwise
     */
    public boolean isValid(String url) {
        try {
            validateAndNormalize(url);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
