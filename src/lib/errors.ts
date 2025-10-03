/**
 * Security-focused error handling utilities
 * Prevents information disclosure in production while maintaining debugging in development
 */

/**
 * Safe error message for client responses
 * Returns generic message in production, detailed in development
 */
export function getSafeErrorMessage(error: unknown): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return error instanceof Error ? error.message : 'Unknown error';
  }
  
  return 'An error occurred. Please try again later.';
}

/**
 * Log error securely (won't expose to client)
 * @param context - Description of where/why the error occurred
 * @param error - The error object
 * @param metadata - Additional context (user ID, request info, etc.)
 */
export function logError(
  context: string,
  error: unknown,
  metadata?: Record<string, unknown>
) {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  
  console.error(`[${timestamp}] ${context}:`, {
    error: errorMessage,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined,
    ...metadata,
  });
}

/**
 * Safe database error message
 * Hides database-specific details that could leak schema information
 */
export function getSafeDatabaseError(error: unknown): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment && error instanceof Error) {
    return error.message;
  }
  
  // Generic database error message for production
  return 'Database operation failed. Please try again.';
}

/**
 * Safe validation error message
 * Formats validation errors safely for client consumption
 */
export function getSafeValidationError(error: unknown): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (error instanceof Error) {
    // In development, show the full validation error
    if (isDevelopment) {
      return error.message;
    }
    
    // In production, show a generic message unless it's a safe validation message
    // (contains no sensitive info like "Invalid input")
    if (error.message.toLowerCase().includes('invalid') || 
        error.message.toLowerCase().includes('required') ||
        error.message.toLowerCase().includes('must')) {
      return error.message;
    }
  }
  
  return 'Invalid input. Please check your data and try again.';
}
