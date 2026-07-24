package com.pagepulse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pagepulse.dto.AuditRequest;
import com.pagepulse.dto.AuditResponse;
import com.pagepulse.exception.*;
import com.pagepulse.service.AuditService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuditController.class)
@DisplayName("AuditController Tests")
class AuditControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuditService auditService;

    @Nested
    @DisplayName("POST /api/audit")
    class PostAudit {

        @Test
        @DisplayName("Should return audit response for valid URL")
        void shouldReturnAuditResponseForValidUrl() throws Exception {
            AuditResponse response = AuditResponse.builder()
                    .status(200)
                    .responseTime(150)
                    .title("Test Page")
                    .metaDescription("Test description")
                    .h1Count(1)
                    .missingAltImages(2)
                    .wordCount(350)
                    .build();

            when(auditService.auditWebsite(anyString())).thenReturn(response);

            AuditRequest request = new AuditRequest("https://example.com");

            mockMvc.perform(post("/api/audit")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value(200))
                    .andExpect(jsonPath("$.responseTime").value(150))
                    .andExpect(jsonPath("$.title").value("Test Page"))
                    .andExpect(jsonPath("$.metaDescription").value("Test description"))
                    .andExpect(jsonPath("$.h1Count").value(1))
                    .andExpect(jsonPath("$.missingAltImages").value(2))
                    .andExpect(jsonPath("$.wordCount").value(350));
        }

        @Test
        @DisplayName("Should return 400 for null URL")
        void shouldReturn400ForNullUrl() throws Exception {
            mockMvc.perform(post("/api/audit")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("Validation Error"));
        }

        @Test
        @DisplayName("Should return 400 for empty URL")
        void shouldReturn400ForEmptyUrl() throws Exception {
            AuditRequest request = new AuditRequest("");

            mockMvc.perform(post("/api/audit")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("Validation Error"));
        }

        @Test
        @DisplayName("Should return 400 for invalid URL")
        void shouldReturn400ForInvalidUrl() throws Exception {
            when(auditService.auditWebsite(anyString()))
                    .thenThrow(new InvalidUrlException("Invalid URL"));

            AuditRequest request = new AuditRequest("invalid");

            mockMvc.perform(post("/api/audit")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("Invalid URL"));
        }

        @Test
        @DisplayName("Should return 408 for connection timeout")
        void shouldReturn408ForTimeout() throws Exception {
            when(auditService.auditWebsite(anyString()))
                    .thenThrow(new ConnectionTimeoutException("Connection timed out"));

            AuditRequest request = new AuditRequest("https://slow-website.com");

            mockMvc.perform(post("/api/audit")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isRequestTimeout())
                    .andExpect(jsonPath("$.error").value("Connection Timeout"));
        }

        @Test
        @DisplayName("Should return 422 for unknown host")
        void shouldReturn422ForUnknownHost() throws Exception {
            when(auditService.auditWebsite(anyString()))
                    .thenThrow(new UnknownHostException("Could not resolve hostname"));

            AuditRequest request = new AuditRequest("https://nonexistent.invalid");

            mockMvc.perform(post("/api/audit")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnprocessableEntity())
                    .andExpect(jsonPath("$.error").value("Unknown Host"));
        }

        @Test
        @DisplayName("Should return 422 for SSL error")
        void shouldReturn422ForSslError() throws Exception {
            when(auditService.auditWebsite(anyString()))
                    .thenThrow(new SslException("SSL certificate error"));

            AuditRequest request = new AuditRequest("https://expired-cert.com");

            mockMvc.perform(post("/api/audit")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnprocessableEntity())
                    .andExpect(jsonPath("$.error").value("SSL Error"));
        }

        @Test
        @DisplayName("Should return 415 for non-HTML content")
        void shouldReturn415ForNonHtmlContent() throws Exception {
            when(auditService.auditWebsite(anyString()))
                    .thenThrow(new UnsupportedContentTypeException("Unsupported content type: application/pdf"));

            AuditRequest request = new AuditRequest("https://example.com/file.pdf");

            mockMvc.perform(post("/api/audit")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnsupportedMediaType())
                    .andExpect(jsonPath("$.error").value("Unsupported Content Type"));
        }

        @Test
        @DisplayName("Should return 400 for invalid JSON body")
        void shouldReturn400ForInvalidJson() throws Exception {
            mockMvc.perform(post("/api/audit")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("invalid json"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("Bad Request"));
        }
    }

    @Nested
    @DisplayName("GET /api/history")
    class GetHistory {

        @Test
        @DisplayName("Should return empty list when no history")
        void shouldReturnEmptyListWhenNoHistory() throws Exception {
            when(auditService.getRecentHistory()).thenReturn(Collections.emptyList());

            mockMvc.perform(get("/api/history"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$").isEmpty());
        }
    }

    @Nested
    @DisplayName("GET /api/health")
    class GetHealth {

        @Test
        @DisplayName("Should return OK")
        void shouldReturnOk() throws Exception {
            mockMvc.perform(get("/api/health"))
                    .andExpect(status().isOk())
                    .andExpect(content().string("OK"));
        }
    }

    @Nested
    @DisplayName("Error Handling")
    class ErrorHandling {

        @Test
        @DisplayName("Should return 405 for unsupported method")
        void shouldReturn405ForUnsupportedMethod() throws Exception {
            mockMvc.perform(get("/api/audit"))
                    .andExpect(status().isMethodNotAllowed());
        }
    }
}
