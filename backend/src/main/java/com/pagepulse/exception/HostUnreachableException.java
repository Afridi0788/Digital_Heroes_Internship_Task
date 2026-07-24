package com.pagepulse.exception;

/**
 * Exception thrown when the target host is unreachable.
 */
public class HostUnreachableException extends RuntimeException {

    public HostUnreachableException(String message) {
        super(message);
    }

    public HostUnreachableException(String message, Throwable cause) {
        super(message, cause);
    }

}
