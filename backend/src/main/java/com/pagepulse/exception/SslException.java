package com.pagepulse.exception;

/**
 * Exception thrown when there's an SSL/TLS certificate error.
 */
public class SslException extends RuntimeException {

    public SslException(String message) {
        super(message);
    }

    public SslException(String message, Throwable cause) {
        super(message, cause);
    }

}
