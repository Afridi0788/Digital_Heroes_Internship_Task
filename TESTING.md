# 🧪 Page Pulse — Testing & Quality Assurance Guide

Comprehensive documentation for testing both the **Spring Boot (Java 21)** backend and **Next.js (TypeScript)** frontend of the Page Pulse Website Auditor application.

---

## 📋 Overview

Both frontend and backend test suites are designed to guarantee complete reliability, correct HTML parsing metrics, robust URL validation, and clear error handling for edge cases and failures.

| Component | Framework | Test Runner | Total Tests | Status |
|-----------|-----------|-------------|-------------|--------|
| **Backend** | JUnit 5 + Mockito + Spring Boot Test | Maven (`mvn test`) | **58** | ✅ **PASSED** |
| **Frontend** | Node.js Test Runner (`node:test`) + Cheerio | `npm test` | **4** | ✅ **PASSED** |

---

## 🛠 Running the Tests

### 1. Backend Unit & Integration Tests

Navigate to the `backend` directory and execute Maven:

```bash
cd backend
mvn test
```

> **Note:** If Maven is installed in a custom location, specify the path to `mvn` / `mvn.cmd`:
> ```cmd
> & "C:\Users\DELL\.maven\maven-3.9.15\bin\mvn.cmd" test
> ```

#### Expected Output:
```text
[INFO] Results:
[INFO] 
[INFO] Tests run: 58, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
```

---

### 2. Frontend Unit Tests & Type Check

Navigate to the `Frontend` directory:

```bash
# Run unit tests
npm test

# Run TypeScript type check
npm run typecheck

# Run Next.js production build check
npm run build
```

#### Expected Output:
```text
▶ HTML Parsing Logic Tests
  ✔ Happy Path: Should correctly parse a valid, standard HTML webpage (23.6ms)
  ✔ Failure Case 1: Should handle empty HTML string gracefully without crashing (2.8ms)
  ✔ Failure Case 2: Should handle malformed HTML with unclosed tags and script content (2.7ms)
  ✔ Failure Case 3: Should support error class instantiation for connection timeout and unsupported content type (0.9ms)
✔ HTML Parsing Logic Tests (33.2ms)
ℹ tests 4 | pass 4 | fail 0
```

---

## 📦 Backend Test Suite Details

Location: `backend/src/test/java/com/pagepulse/`

### 1. `util/HtmlParserTest.java` — Parsing Logic Tests
Tests the extraction of HTML metrics using Jsoup.

- **Title Extraction**:
  - Extract `<title>` content.
  - Fall back to `<meta property="og:title">` if title tag is empty.
  - Return `"No title found"` when absent.
  - Trim surrounding whitespace.

- **Meta Description Extraction**:
  - Extract `<meta name="description">`.
  - Fall back to `og:description` or `twitter:description`.
  - Return `"No meta description found"` when absent.

- **H1 Tag Counting**:
  - Single H1 count.
  - Multiple H1 count.
  - 0 H1 tag handling.

- **Missing ALT Image Check**:
  - Detect `<img>` tags missing `alt` attribute or with empty `alt=""`.
  - Ignore valid `alt` attributes.

- **Word Count Calculation**:
  - Count body text words.
  - Exclude `<script>`, `<style>`, `<noscript>`, `<head>`, and `display:none` content.

- **Happy Path & Failure Cases**:
  - **Happy Path**: Complete valid HTML document parsing.
  - **Failure Case 1**: Empty/blank HTML document parsing returns default metrics without throwing exceptions.
  - **Failure Case 2**: Malformed HTML with unclosed tags and embedded scripts parses safely and strips script text.

---

### 2. `validation/UrlValidatorTest.java` — URL Validation Tests
Tests normalization, protocol validation, and domain checks.

- **Valid URLs**:
  - HTTP & HTTPS protocols.
  - Prepending `https://` when scheme is missing (e.g. `example.com` -> `https://example.com`).
  - Trimming whitespace, handling paths, query strings, and `localhost`.

- **Invalid & Unsupported Protocols**:
  - Null, empty, or whitespace-only inputs (`InvalidUrlException`).
  - Non-HTTP protocols like `ftp://` (`InvalidUrlException: Only HTTP and HTTPS protocols are supported`).
  - Domain TLD checks (e.g. rejecting `https://invalid`).

- **Malformed URLs**:
  - Rejecting syntax errors like `https://[invalid` (`MalformedUrlException`).

---

### 3. `service/AuditServiceTest.java` — Service Layer Tests
Mocks network calls and Jsoup execution.

- **Happy Path**: Successfully audits valid URLs and records successful audit in `AuditHistoryRepository`.
- **Error Handling**: Handles `SocketTimeoutException` -> `ConnectionTimeoutException`, `UnknownHostException`, `SSLException`, `ConnectException` -> `HostUnreachableException`, saving failures to `AuditHistoryRepository`.

---

### 4. `controller/AuditControllerTest.java` — REST Controller Tests
Uses `MockMvc` to test API endpoints (`POST /api/audit`, `GET /api/history`, `GET /api/health`).

- Returns `200 OK` for valid audit requests.
- Returns `400 BAD_REQUEST` for invalid JSON, missing URLs, or empty strings.
- Returns `408 REQUEST_TIMEOUT`, `415 UNSUPPORTED_MEDIA_TYPE`, `422 UNPROCESSABLE_ENTITY`, `502 BAD_GATEWAY` for errors.

---

## 🎨 Frontend Test Suite Details

Location: `Frontend/src/lib/audit-service.test.ts`

Uses Node.js native test runner (`node:test`) and strict assertions (`node:assert/strict`) to verify HTML parsing and error handling logic.

### Tested Scenarios:

1. **Happy Path**:
   - Parses standard HTML structure with `<title>`, meta description, `<h1>`, `<img>` tags (with and without `alt`), and visible body text.
   - Asserts status, response time, title, description, H1 count, missing alt count, and word count.

2. **Failure Case 1 (Empty Input)**:
   - Parses empty string (`""`).
   - Asserts fallback values (`"No title found"`, `"No meta description found"`, 0 H1s, 0 missing ALT images, 0 words).

3. **Failure Case 2 (Malformed HTML)**:
   - Parses malformed HTML with unclosed `<div>` and `<h1>`, missing `alt` images, `<script>` tags, and `<style>` blocks.
   - Asserts script/style text is stripped and HTML is parsed without throwing.

4. **Failure Case 3 (Error Classes)**:
   - Instantiates custom error classes (`UnsupportedContentTypeError`, `ConnectionTimeoutError`, `UnknownHostError`, `HostUnreachableError`, `SSLError`, `FetchError`) to verify error names and messages.

---

## 🛡 CI/CD Best Practices & Integration

To integrate tests into a CI/CD pipeline (e.g. GitHub Actions):

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'
      - name: Run Maven Tests
        run: cd backend && mvn test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - name: Install & Run Tests
        run: |
          cd Frontend
          npm ci
          npm test
          npm run typecheck
```
