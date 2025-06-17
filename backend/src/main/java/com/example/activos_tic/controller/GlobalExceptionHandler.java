package com.example.activos_tic.controller;

import com.example.activos_tic.dto.MessageResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<MessageResponse> handleEntityNotFoundException(EntityNotFoundException ex, WebRequest request) {
        MessageResponse errorResponse = new MessageResponse(ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MessageResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                                .collect(Collectors.toList());
        // Return a more structured error if needed, for now just the first one or a combined message
        String errorMessage = "Validation failed: " + errors.stream().collect(Collectors.joining(", "));
        MessageResponse errorResponse = new MessageResponse(errorMessage);
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class) // Catch-all for other runtime exceptions from services (like duplicate username)
    public ResponseEntity<MessageResponse> handleGenericRuntimeException(RuntimeException ex, WebRequest request) {
        // Log the exception here for server-side tracking
        // logger.error("Runtime Exception: ", ex);
        MessageResponse errorResponse = new MessageResponse("An error occurred: " + ex.getMessage());
        // Use BAD_REQUEST for client errors, INTERNAL_SERVER_ERROR for true server issues
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponse> handleGlobalException(Exception ex, WebRequest request) {
        // Log the exception here
        // logger.error("Unhandled Exception: ", ex);
        MessageResponse errorResponse = new MessageResponse("An unexpected error occurred. Please try again later.");
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
