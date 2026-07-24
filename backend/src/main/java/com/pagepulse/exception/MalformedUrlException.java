package com.pagepulse.exception;

/**
 * Exception thrown when the URL is malformed.
 */
public class MalformedUrlException extends RuntimeException {

    public MalformedUrlException(String message) {
        super(message);
    }

    public MalformedUrlException(String message, Throwable cause) {
        super(message, cause);
    }

}
