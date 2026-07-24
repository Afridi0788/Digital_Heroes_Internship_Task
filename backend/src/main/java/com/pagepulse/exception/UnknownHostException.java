package com.pagepulse.exception;

/**
 * Exception thrown when the hostname cannot be resolved.
 */
public class UnknownHostException extends RuntimeException {

    public UnknownHostException(String message) {
        super(message);
    }

    public UnknownHostException(String message, Throwable cause) {
        super(message, cause);
    }

}
