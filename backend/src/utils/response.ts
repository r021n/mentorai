import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface SuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export interface ValidationErrorItem {
  field: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: ValidationErrorItem[];
}

export function sendSuccess<T>(
  c: Context,
  data?: T,
  message?: string,
  status: ContentfulStatusCode = 200
) {
  const payload: SuccessResponse<T> = {
    success: true,
  };
  if (data !== undefined) {
    payload.data = data;
  }
  if (message !== undefined) {
    payload.message = message;
  }
  return c.json(payload, status);
}

export function sendError(
  c: Context,
  message: string,
  status: ContentfulStatusCode = 400,
  errors?: ValidationErrorItem[]
) {
  const payload: ErrorResponse = {
    success: false,
    message,
  };
  if (errors && errors.length > 0) {
    payload.errors = errors;
  }
  return c.json(payload, status);
}
