package com.pagepulse.exception;

/**
 * Exception thrown when the connection to the target website times out.
 */
public class ConnectionTimeoutException extends RuntimeException {

    public ConnectionTimeoutException(String message) {
        super(message);
    }

    public ConnectionTimeoutException(String message, Throwable cause) {
        super(message, cause);
    }

}
