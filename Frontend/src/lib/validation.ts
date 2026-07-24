/** Validates a URL string and returns an error message or null if valid */
export function validateUrl(url: string | null | undefined): string | null {
  if (url === null || url === undefined) {
    return "URL is required";
  }

  const trimmed = url.trim();

  if (trimmed === "") {
    return "URL cannot be empty";
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return "Please provide a valid URL (e.g., https://example.com)";
  }

  const protocol = parsed.protocol.toLowerCase();
  if (protocol !== "http:" && protocol !== "https:") {
    return "Only HTTP and HTTPS protocols are supported";
  }

  if (!parsed.hostname || parsed.hostname.length === 0) {
    return "URL must include a valid hostname";
  }

  return null;
}

/** Normalizes a URL string by adding https:// if no protocol is specified */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}
