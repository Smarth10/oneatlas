import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(code: string, message: string, status: number, details?: unknown) {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

export function handleError(e: unknown) {
  if (e instanceof ZodError) {
    return apiError("VALIDATION_ERROR", "Invalid request parameters", 400, e.flatten());
  }
  console.error(e);
  return apiError("INTERNAL_ERROR", "Something went wrong", 500);
}
