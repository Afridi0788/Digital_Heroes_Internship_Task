package com.pagepulse.exception;

/**
 * Exception thrown when the target website returns an HTTP error.
 */
public class HttpErrorException extends RuntimeException {

    private final int statusCode;

    public HttpErrorException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public HttpErrorException(String message, int statusCode, Throwable cause) {
        super(message, cause);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }

}
