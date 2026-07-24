import { NextRequest, NextResponse } from "next/server";
import { validateUrl } from "@/lib/validation";
import {
  auditWebpage,
  ConnectionTimeoutError,
  UnknownHostError,
  HostUnreachableError,
  SSLError,
  UnsupportedContentTypeError,
  FetchError,
} from "@/lib/audit-service";
import { db } from "@/db";
import { auditHistory } from "@/db/schema";
import type { ErrorResponse } from "@/lib/types";

function createErrorResponse(
  status: number,
  error: string,
  message: string
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      status,
      error,
      message,
    },
    { status }
  );
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: { url?: string };

  try {
    body = await request.json();
  } catch {
    return createErrorResponse(400, "Bad Request", "Request body must be valid JSON with a 'url' field");
  }

  const url = body.url;

  // Validate URL
  const validationError = validateUrl(url);
  if (validationError) {
    return createErrorResponse(400, "Invalid URL", validationError);
  }

  const validUrl = url!.trim();

  try {
    const result = await auditWebpage(validUrl);

    // Save to history
    try {
      if (db) {
        await db.insert(auditHistory).values({
          url: validUrl,
          status: result.status,
          responseTime: result.responseTime,
          title: result.title,
          metaDescription: result.metaDescription,
          h1Count: result.h1Count,
          missingAltImages: result.missingAltImages,
          wordCount: result.wordCount,
        });
      }
    } catch {
      // Don't fail the audit if history save fails
      console.error("Failed to save audit to history");
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    let errorMsg = "An unexpected error occurred";
    let statusCode = 500;
    let errorType = "Internal Server Error";

    if (err instanceof ConnectionTimeoutError) {
      statusCode = 408;
      errorType = "Connection Timeout";
      errorMsg = err.message;
    } else if (err instanceof UnknownHostError) {
      statusCode = 422;
      errorType = "Unknown Host";
      errorMsg = err.message;
    } else if (err instanceof HostUnreachableError) {
      statusCode = 422;
      errorType = "Host Unreachable";
      errorMsg = err.message;
    } else if (err instanceof SSLError) {
      statusCode = 422;
      errorType = "SSL Error";
      errorMsg = err.message;
    } else if (err instanceof UnsupportedContentTypeError) {
      statusCode = 415;
      errorType = "Unsupported Content Type";
      errorMsg = err.message;
    } else if (err instanceof FetchError) {
      statusCode = 502;
      errorType = "Fetch Error";
      errorMsg = err.message;
    } else {
      errorMsg = "An unexpected error occurred while auditing the website";
    }

    // Save error to history
    try {
      if (db) {
        await db.insert(auditHistory).values({
          url: validUrl,
          error: errorMsg,
        });
      }
    } catch {
      console.error("Failed to save error to history");
    }

    return createErrorResponse(statusCode, errorType, errorMsg);
  }
}
