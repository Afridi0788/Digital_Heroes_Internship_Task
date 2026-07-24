package com.pagepulse.exception;

/**
 * Exception thrown when the response content type is not HTML.
 */
public class UnsupportedContentTypeException extends RuntimeException {

    public UnsupportedContentTypeException(String message) {
        super(message);
    }

    public UnsupportedContentTypeException(String message, Throwable cause) {
        super(message, cause);
    }

}
