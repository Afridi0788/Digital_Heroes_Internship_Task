package com.pagepulse.exception;

import com.pagepulse.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for the application.
 * Provides consistent error responses across all endpoints.
 * Never exposes stack traces to clients.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(InvalidUrlException.class)
    public ResponseEntity<ErrorResponse> handleInvalidUrl(InvalidUrlException ex) {
        log.warn("Invalid URL: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(400, "Invalid URL", ex.getMessage()));
    }

    @ExceptionHandler(MalformedUrlException.class)
    public ResponseEntity<ErrorResponse> handleMalformedUrl(MalformedUrlException ex) {
        log.warn("Malformed URL: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(400, "Malformed URL", ex.getMessage()));
    }

    @ExceptionHandler(ConnectionTimeoutException.class)
    public ResponseEntity<ErrorResponse> handleConnectionTimeout(ConnectionTimeoutException ex) {
        log.warn("Connection timeout: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.REQUEST_TIMEOUT)
                .body(ErrorResponse.of(408, "Connection Timeout", ex.getMessage()));
    }

    @ExceptionHandler(HostUnreachableException.class)
    public ResponseEntity<ErrorResponse> handleHostUnreachable(HostUnreachableException ex) {
        log.warn("Host unreachable: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ErrorResponse.of(422, "Host Unreachable", ex.getMessage()));
    }

    @ExceptionHandler(UnknownHostException.class)
    public ResponseEntity<ErrorResponse> handleUnknownHost(UnknownHostException ex) {
        log.warn("Unknown host: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ErrorResponse.of(422, "Unknown Host", ex.getMessage()));
    }

    @ExceptionHandler(SslException.class)
    public ResponseEntity<ErrorResponse> handleSslException(SslException ex) {
        log.warn("SSL error: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(ErrorResponse.of(422, "SSL Error", ex.getMessage()));
    }

    @ExceptionHandler(UnsupportedContentTypeException.class)
    public ResponseEntity<ErrorResponse> handleUnsupportedContentType(UnsupportedContentTypeException ex) {
        log.warn("Unsupported content type: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .body(ErrorResponse.of(415, "Unsupported Content Type", ex.getMessage()));
    }

    @ExceptionHandler(HttpErrorException.class)
    public ResponseEntity<ErrorResponse> handleHttpError(HttpErrorException ex) {
        log.warn("HTTP error {}: {}", ex.getStatusCode(), ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(ErrorResponse.of(502, "HTTP Error", ex.getMessage()));
    }

    @ExceptionHandler(FetchException.class)
    public ResponseEntity<ErrorResponse> handleFetchException(FetchException ex) {
        log.error("Fetch error: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(ErrorResponse.of(502, "Fetch Error", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");
        log.warn("Validation error: {}", message);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(400, "Validation Error", message));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        log.warn("Invalid request body: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(400, "Bad Request", "Request body must be valid JSON with a 'url' field"));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        log.warn("Method not supported: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(ErrorResponse.of(405, "Method Not Allowed", "Use POST method for this endpoint"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error: ", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(500, "Internal Server Error",
                        "An unexpected error occurred. Please try again later."));
    }

}
