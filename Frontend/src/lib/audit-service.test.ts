import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  analyzeHtml,
  UnsupportedContentTypeError,
  ConnectionTimeoutError,
} from "./audit-service";

describe("HTML Parsing Logic Tests", () => {
  test("Happy Path: Should correctly parse a valid, standard HTML webpage", () => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>  Page Pulse Test Title  </title>
        <meta name="description" content="An awesome website auditing tool for SEO and performance." />
      </head>
      <body>
        <h1>Welcome to Page Pulse</h1>
        <p>This is a sample paragraph with several words to audit.</p>
        <img src="/logo.png" alt="Company Logo" />
        <img src="/banner.png" />
      </body>
      </html>
    `;

    const result = analyzeHtml(html, 200, 120);

    assert.equal(result.status, 200);
    assert.equal(result.responseTime, 120);
    assert.equal(result.title, "Page Pulse Test Title");
    assert.equal(
      result.metaDescription,
      "An awesome website auditing tool for SEO and performance."
    );
    assert.equal(result.h1Count, 1);
    assert.equal(result.missingAltImages, 1);
    assert.ok(result.wordCount > 0, "Word count should be greater than 0");
  });

  test("Failure Case 1: Should handle empty HTML string gracefully without crashing", () => {
    const html = "";

    const result = analyzeHtml(html, 200, 45);

    assert.equal(result.status, 200);
    assert.equal(result.responseTime, 45);
    assert.equal(result.title, "No title found");
    assert.equal(result.metaDescription, "No meta description found");
    assert.equal(result.h1Count, 0);
    assert.equal(result.missingAltImages, 0);
    assert.equal(result.wordCount, 0);
  });

  test("Failure Case 2: Should handle malformed HTML with unclosed tags and script content", () => {
    const html = `
      <div><h1>Unclosed Header
      <p>Body text here <img src="broken.jpg">
      <script>const hidden = "this script text should be excluded from word count";</script>
      <style>body { color: red; }</style>
    `;

    const result = analyzeHtml(html, 500, 350);

    assert.equal(result.status, 500);
    assert.equal(result.responseTime, 350);
    assert.equal(result.title, "No title found");
    assert.equal(result.metaDescription, "No meta description found");
    assert.equal(result.h1Count, 1);
    assert.equal(result.missingAltImages, 1);
    // Ensure scripts and styles are stripped out of word count
    assert.equal(result.wordCount, 5); // "Unclosed Header Body text here"
  });

  test("Failure Case 3: Should support error class instantiation for connection timeout and unsupported content type", () => {
    const contentTypeErr = new UnsupportedContentTypeError("Unsupported content type: application/pdf");
    assert.equal(contentTypeErr.name, "UnsupportedContentTypeError");
    assert.equal(contentTypeErr.message, "Unsupported content type: application/pdf");

    const timeoutErr = new ConnectionTimeoutError("Connection timed out after 15000ms");
    assert.equal(timeoutErr.name, "ConnectionTimeoutError");
    assert.equal(timeoutErr.message, "Connection timed out after 15000ms");
  });
});
