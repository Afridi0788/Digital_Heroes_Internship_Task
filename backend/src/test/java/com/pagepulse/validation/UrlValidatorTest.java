package com.pagepulse.validation;

import com.pagepulse.exception.InvalidUrlException;
import com.pagepulse.exception.MalformedUrlException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("UrlValidator Tests")
class UrlValidatorTest {

    private UrlValidator urlValidator;

    @BeforeEach
    void setUp() {
        urlValidator = new UrlValidator();
    }

    @Nested
    @DisplayName("Valid URLs")
    class ValidUrls {

        @Test
        @DisplayName("Should accept HTTPS URL")
        void shouldAcceptHttpsUrl() {
            String result = urlValidator.validateAndNormalize("https://example.com");
            assertEquals("https://example.com", result);
        }

        @Test
        @DisplayName("Should accept HTTP URL")
        void shouldAcceptHttpUrl() {
            String result = urlValidator.validateAndNormalize("http://example.com");
            assertEquals("http://example.com", result);
        }

        @Test
        @DisplayName("Should add HTTPS to URL without protocol")
        void shouldAddHttpsToUrlWithoutProtocol() {
            String result = urlValidator.validateAndNormalize("example.com");
            assertEquals("https://example.com", result);
        }

        @Test
        @DisplayName("Should trim whitespace from URL")
        void shouldTrimWhitespace() {
            String result = urlValidator.validateAndNormalize("  https://example.com  ");
            assertEquals("https://example.com", result);
        }

        @Test
        @DisplayName("Should accept URL with path")
        void shouldAcceptUrlWithPath() {
            String result = urlValidator.validateAndNormalize("https://example.com/page");
            assertEquals("https://example.com/page", result);
        }

        @Test
        @DisplayName("Should accept URL with query string")
        void shouldAcceptUrlWithQueryString() {
            String result = urlValidator.validateAndNormalize("https://example.com?foo=bar");
            assertEquals("https://example.com?foo=bar", result);
        }

        @Test
        @DisplayName("Should accept localhost")
        void shouldAcceptLocalhost() {
            String result = urlValidator.validateAndNormalize("http://localhost:8080");
            assertEquals("http://localhost:8080", result);
        }
    }

    @Nested
    @DisplayName("Invalid URLs")
    class InvalidUrls {

        @Test
        @DisplayName("Should reject null URL")
        void shouldRejectNullUrl() {
            InvalidUrlException exception = assertThrows(
                    InvalidUrlException.class,
                    () -> urlValidator.validateAndNormalize(null)
            );
            assertEquals("URL is required", exception.getMessage());
        }

        @Test
        @DisplayName("Should reject empty URL")
        void shouldRejectEmptyUrl() {
            InvalidUrlException exception = assertThrows(
                    InvalidUrlException.class,
                    () -> urlValidator.validateAndNormalize("")
            );
            assertEquals("URL cannot be empty", exception.getMessage());
        }

        @Test
        @DisplayName("Should reject whitespace-only URL")
        void shouldRejectWhitespaceOnlyUrl() {
            InvalidUrlException exception = assertThrows(
                    InvalidUrlException.class,
                    () -> urlValidator.validateAndNormalize("   ")
            );
            assertEquals("URL cannot be empty", exception.getMessage());
        }

        @Test
        @DisplayName("Should reject FTP protocol")
        void shouldRejectFtpProtocol() {
            InvalidUrlException exception = assertThrows(
                    InvalidUrlException.class,
                    () -> urlValidator.validateAndNormalize("ftp://example.com")
            );
            assertTrue(exception.getMessage().contains("Only HTTP and HTTPS"));
        }

        @Test
        @DisplayName("Should reject invalid domain without TLD")
        void shouldRejectInvalidDomain() {
            InvalidUrlException exception = assertThrows(
                    InvalidUrlException.class,
                    () -> urlValidator.validateAndNormalize("https://invalid")
            );
            assertTrue(exception.getMessage().contains("valid domain"));
        }
    }

    @Nested
    @DisplayName("Malformed URLs")
    class MalformedUrls {

        @Test
        @DisplayName("Should reject malformed URL")
        void shouldRejectMalformedUrl() {
            assertThrows(
                    MalformedUrlException.class,
                    () -> urlValidator.validateAndNormalize("https://[invalid")
            );
        }
    }

    @Nested
    @DisplayName("isValid Method")
    class IsValidMethod {

        @Test
        @DisplayName("Should return true for valid URL")
        void shouldReturnTrueForValidUrl() {
            assertTrue(urlValidator.isValid("https://example.com"));
        }

        @Test
        @DisplayName("Should return false for invalid URL")
        void shouldReturnFalseForInvalidUrl() {
            assertFalse(urlValidator.isValid(null));
            assertFalse(urlValidator.isValid(""));
            assertFalse(urlValidator.isValid("ftp://example.com"));
        }
    }
}
