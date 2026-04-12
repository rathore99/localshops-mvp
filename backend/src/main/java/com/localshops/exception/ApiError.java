package com.localshops.exception;

public record ApiError(String error, String field) {
    public static ApiError of(String message) {
        return new ApiError(message, null);
    }
}
