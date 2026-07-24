package com.pagepulse.exception;

/**
 * Exception thrown when the provided URL is invalid.
 */
public class InvalidUrlException extends RuntimeException {

    public InvalidUrlException(String message) {
        super(message);
    }

    public InvalidUrlException(String message, Throwable cause) {
        super(message, cause);
    }

}
