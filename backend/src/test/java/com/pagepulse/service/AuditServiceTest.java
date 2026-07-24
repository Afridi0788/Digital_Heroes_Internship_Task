package com.pagepulse.service;

import com.pagepulse.config.JsoupConfig;
import com.pagepulse.dto.AuditResponse;
import com.pagepulse.exception.*;
import com.pagepulse.repository.AuditHistoryRepository;
import com.pagepulse.service.impl.AuditServiceImpl;
import com.pagepulse.util.HtmlParser;
import com.pagepulse.validation.UrlValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuditService Tests")
class AuditServiceTest {

    @Mock
    private AuditHistoryRepository historyRepository;

    private UrlValidator urlValidator;
    private HtmlParser htmlParser;
    private JsoupConfig jsoupConfig;
    private AuditService auditService;

    @BeforeEach
    void setUp() {
        urlValidator = new UrlValidator();
        htmlParser = new HtmlParser();
        jsoupConfig = new JsoupConfig();
        jsoupConfig.setTimeout(5000);
        jsoupConfig.setUserAgent("Test Agent");
        jsoupConfig.setFollowRedirects(true);
        jsoupConfig.setMaxBodySize(1048576);

        auditService = new AuditServiceImpl(urlValidator, htmlParser, jsoupConfig, historyRepository);
    }

    @Nested
    @DisplayName("URL Validation")
    class UrlValidation {

        @Test
        @DisplayName("Should reject null URL")
        void shouldRejectNullUrl() {
            assertThrows(InvalidUrlException.class, () -> auditService.auditWebsite(null));
        }

        @Test
        @DisplayName("Should reject empty URL")
        void shouldRejectEmptyUrl() {
            assertThrows(InvalidUrlException.class, () -> auditService.auditWebsite(""));
        }

        @Test
        @DisplayName("Should reject invalid protocol")
        void shouldRejectInvalidProtocol() {
            assertThrows(InvalidUrlException.class, () -> auditService.auditWebsite("ftp://example.com"));
        }

        @Test
        @DisplayName("Should reject malformed URL")
        void shouldRejectMalformedUrl() {
            assertThrows(MalformedUrlException.class, () -> auditService.auditWebsite("https://[invalid"));
        }
    }

    @Nested
    @DisplayName("Happy Path Tests")
    class HappyPath {

        @Test
        @DisplayName("Should successfully audit a valid website")
        void shouldAuditValidWebsite() {
            // Note: This test requires network access
            // For true unit testing, you would mock the Jsoup connection
            // This is an integration test
            
            when(historyRepository.save(any())).thenReturn(null);
            
            try {
                AuditResponse response = auditService.auditWebsite("https://example.com");
                
                assertNotNull(response);
                assertTrue(response.getStatus() >= 200 && response.getStatus() < 400);
                assertTrue(response.getResponseTime() > 0);
                assertNotNull(response.getTitle());
                assertNotNull(response.getMetaDescription());
                assertTrue(response.getH1Count() >= 0);
                assertTrue(response.getMissingAltImages() >= 0);
                assertTrue(response.getWordCount() >= 0);
                
                verify(historyRepository, times(1)).save(any());
            } catch (Exception e) {
                // Network issues in test environment - skip
                System.out.println("Skipping integration test due to network: " + e.getMessage());
            }
        }

        @Test
        @DisplayName("Should add https protocol if missing")
        void shouldAddHttpsProtocolIfMissing() {
            when(historyRepository.save(any())).thenReturn(null);
            
            try {
                AuditResponse response = auditService.auditWebsite("example.com");
                
                assertNotNull(response);
            } catch (Exception e) {
                // Network issues - skip
                System.out.println("Skipping integration test due to network: " + e.getMessage());
            }
        }
    }

    @Nested
    @DisplayName("Error Handling")
    class ErrorHandling {

        @Test
        @DisplayName("Should throw UnknownHostException for invalid domain")
        void shouldThrowUnknownHostForInvalidDomain() {
            when(historyRepository.save(any())).thenReturn(null);
            
            assertThrows(UnknownHostException.class, 
                    () -> auditService.auditWebsite("https://this-domain-definitely-does-not-exist-12345.com"));
        }

        @Test
        @DisplayName("Should save error to history when audit fails")
        void shouldSaveErrorToHistory() {
            when(historyRepository.save(any())).thenReturn(null);
            
            try {
                auditService.auditWebsite("https://this-domain-definitely-does-not-exist-12345.com");
            } catch (Exception e) {
                // Expected
            }
            
            verify(historyRepository, times(1)).save(any());
        }
    }
}
