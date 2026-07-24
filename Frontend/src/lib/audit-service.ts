import * as cheerio from "cheerio";
import type { AuditResponse } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (compatible; PagePulseBot/1.0; +https://pagepulse.app)";
const TIMEOUT_MS = 15000;

interface FetchResult {
  html: string;
  status: number;
  responseTime: number;
  contentType: string;
}

/** Fetches the webpage HTML with timeout and custom headers */
async function fetchPage(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    const responseTime = Date.now() - startTime;
    const contentType = response.headers.get("content-type") || "";

    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml") &&
      !contentType.includes("text/plain")
    ) {
      throw new UnsupportedContentTypeError(
        `Unsupported content type: ${contentType}. Only HTML pages can be audited.`
      );
    }

    const html = await response.text();

    return {
      html,
      status: response.status,
      responseTime,
      contentType,
    };
  } catch (error: unknown) {
    if (error instanceof UnsupportedContentTypeError) {
      throw error;
    }

    const err = error as Error;

    if (err.name === "AbortError") {
      throw new ConnectionTimeoutError(
        `Connection timed out after ${TIMEOUT_MS}ms. The website may be slow or unreachable.`
      );
    }

    const message = err.message || "";

    if (
      message.includes("ENOTFOUND") ||
      message.includes("getaddrinfo")
    ) {
      throw new UnknownHostError(
        `Could not resolve hostname. Please check the URL and try again.`
      );
    }

    if (
      message.includes("ECONNREFUSED") ||
      message.includes("EHOSTUNREACH")
    ) {
      throw new HostUnreachableError(
        `The host is unreachable. The server may be down or blocking connections.`
      );
    }

    if (
      message.includes("ECONNRESET") ||
      message.includes("ETIMEDOUT")
    ) {
      throw new ConnectionTimeoutError(
        `Connection was reset or timed out. Please try again later.`
      );
    }

    if (
      message.includes("certificate") ||
      message.includes("SSL") ||
      message.includes("TLS") ||
      message.includes("CERT") ||
      message.includes("self-signed") ||
      message.includes("UNABLE_TO_VERIFY")
    ) {
      throw new SSLError(
        `SSL/TLS error encountered. The website may have an invalid or expired certificate.`
      );
    }

    throw new FetchError(`Failed to fetch the webpage: ${message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Analyzes HTML content and extracts audit metrics */
export function analyzeHtml(
  html: string,
  status: number,
  responseTime: number
): AuditResponse {
  const $ = cheerio.load(html);

  // Extract page title
  const title = $("title").first().text().trim() || "No title found";

  // Extract meta description
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    "No meta description found";

  // Count H1 tags
  const h1Count = $("h1").length;

  // Count images missing ALT attribute
  const allImages = $("img");
  let missingAltImages = 0;
  allImages.each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt === undefined || alt.trim() === "") {
      missingAltImages++;
    }
  });

  // Calculate word count from visible body text only
  // Remove script, style, and hidden elements
  $("script").remove();
  $("style").remove();
  $("noscript").remove();
  $('[style*="display:none"], [style*="display: none"]').remove();
  $('[hidden]').remove();
  $("head").remove();

  const bodyText = $("body").text() || $.text();
  const words = bodyText
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const wordCount = words.length;

  return {
    status,
    responseTime,
    title,
    metaDescription,
    h1Count,
    missingAltImages,
    wordCount,
  };
}

/** Main audit function - fetches and analyzes a webpage */
export async function auditWebpage(url: string): Promise<AuditResponse> {
  const fetchResult = await fetchPage(url);
  return analyzeHtml(fetchResult.html, fetchResult.status, fetchResult.responseTime);
}

// Custom error classes for specific error types
export class ConnectionTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConnectionTimeoutError";
  }
}

export class UnknownHostError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnknownHostError";
  }
}

export class HostUnreachableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HostUnreachableError";
  }
}

export class SSLError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SSLError";
  }
}

export class UnsupportedContentTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedContentTypeError";
  }
}

export class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}
