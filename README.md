# 📊 Page Pulse — Website Audit Tool

A production-ready full-stack web application that audits any public website URL. Enter a URL to analyze page structure, SEO elements, accessibility metrics, and performance — all from a beautiful, responsive dashboard.

---

## 📁 Project Structure

```
page-pulse/
│
├── backend/                 # Spring Boot 3 + Java 21 + MySQL
│   ├── src/main/java/       # Java source files
│   ├── src/test/java/       # Unit tests (JUnit 5 + Mockito)
│   ├── pom.xml              # Maven configuration
│   └── README.md            # Backend documentation
│
├── src/                     # Next.js Frontend (React 19 + TypeScript)
│   ├── app/                 # App router pages & API routes
│   ├── components/          # React components
│   ├── lib/                 # Utilities & types
│   └── db/                  # Database (Drizzle ORM)
│
├── package.json             # Frontend dependencies
└── README.md                # This file
```

---

## ✨ Features

### Core Functionality
- **Website Auditing** — Fetch and analyze any public HTTP/HTTPS webpage
- **SEO Analysis** — Extract page title, meta description, H1 tag count
- **Accessibility Check** — Detect images missing ALT attributes
- **Content Analysis** — Calculate approximate visible word count
- **Performance Metrics** — Measure response time and HTTP status

### UI/UX
- 🌙 **Dark Mode Toggle** — Persisted theme preference
- 🎨 **Gradient Background** — Beautiful gradients in light and dark modes
- 💎 **Glassmorphism Cards** — Modern frosted glass effect
- ✨ **Smooth Animations** — Fade-in, slide-up, pulse effects
- 📱 **Fully Responsive** — Mobile-first design
- ⌨️ **Keyboard Support** — Press Enter to submit
- 🔄 **Loading Indicator** — Animated spinner
- 🔔 **Toast Notifications** — Success/error/info toasts

### Bonus Features
- 📋 **Recent Searches** — View and re-run previous audits
- 📄 **Copy JSON Report** — Copy full report to clipboard
- 💾 **Download Report** — Download audit report as JSON
- 🔄 **Reset Button** — Clear form and results
- 💀 **Skeleton Loading** — Loading placeholders
- 🚫 **404 Page** — Custom not-found page
- ♿ **Accessibility** — ARIA labels, semantic HTML
- 🔍 **SEO Friendly** — Meta tags, Open Graph

---

## 🛠 Tech Stack

### Frontend
| Technology | Version |
|------------|---------|
| React | 19 |
| TypeScript | 5.x |
| Next.js | 16 (App Router) |
| Tailwind CSS | 4 |
| Lucide React | Icons |

### Backend (Spring Boot)
| Technology | Version |
|------------|---------|
| Java | 21 |
| Spring Boot | 3.2 |
| Spring Web | REST APIs |
| Spring Validation | Request validation |
| Spring Data JPA | Database access |
| MySQL | 8.0 |
| Jsoup | HTML parsing |
| Lombok | Boilerplate reduction |
| JUnit 5 | Testing |
| Mockito | Mocking |

### Alternative Backend (Next.js API Routes)
| Technology | Version |
|------------|---------|
| Next.js API Routes | Built-in |
| PostgreSQL | 14+ |
| Drizzle ORM | Database |
| Cheerio | HTML parsing |

---

## 🏗 Architecture

### Backend Packages (Clean Architecture)
```
com.pagepulse/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/             # Data Transfer Objects
├── entity/          # JPA entities
├── exception/       # Custom exceptions & global handler
├── repository/      # JPA repositories
├── service/         # Service interfaces
│   └── impl/        # Service implementations
├── util/            # Utility classes (HtmlParser)
└── validation/      # URL validation
```

### Design Principles
- **SOLID Principles** — Single responsibility, proper abstractions
- **Constructor Injection** — No field injection
- **Clean Architecture** — Separation of concerns
- **Error Boundaries** — Custom exception classes
- **Consistent API** — Uniform JSON responses

---

## 📡 API Documentation

### `POST /api/audit`

Audit a website URL.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Success Response (200):**
```json
{
  "status": 200,
  "responseTime": 125,
  "title": "Example Domain",
  "metaDescription": "Example website",
  "h1Count": 1,
  "missingAltImages": 2,
  "wordCount": 350
}
```

**Error Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": 400,
  "error": "Invalid URL",
  "message": "Please provide a valid HTTP or HTTPS URL"
}
```

### Error Codes

| Status | Error Type | Description |
|--------|------------|-------------|
| 400 | Invalid URL | Null, empty, or malformed URL |
| 400 | Malformed URL | Cannot parse URL |
| 408 | Connection Timeout | Server took too long |
| 415 | Unsupported Content Type | Response is not HTML |
| 422 | Unknown Host | DNS resolution failed |
| 422 | Host Unreachable | Server is down |
| 422 | SSL Error | Invalid certificate |
| 502 | Fetch Error | General fetch failure |

### `GET /api/history`

Get the 10 most recent audit searches.

### `GET /api/health`

Health check endpoint.

---

## 🚀 Installation

### Option 1: Spring Boot Backend + React Frontend

#### Backend Setup

1. **Prerequisites:**
   - Java 21
   - Maven 3.8+
   - MySQL 8.0+

2. **Create MySQL Database:**
   ```sql
   CREATE DATABASE page_pulse_db;
   ```

3. **Configure Database:**
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/page_pulse_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

4. **Run Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Server starts at `http://localhost:8080`

#### Frontend Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure API URL:**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. **Run Frontend:**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:3000`

### Option 2: Next.js Full-Stack (PostgreSQL)

1. **Prerequisites:**
   - Node.js 18+
   - PostgreSQL 14+

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Database:**
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/page_pulse_db
   ```

4. **Push Schema:**
   ```bash
   npx drizzle-kit push
   ```

5. **Run:**
   ```bash
   npm run dev
   ```

---

## 🧪 Running Tests

For detailed test documentation and architecture, see [TESTING.md](TESTING.md).

### Backend Tests (JUnit 5 + Mockito)
```bash
cd backend
mvn test
```

**Test Coverage:**
- ✅ URL Validation (null, empty, malformed, unsupported protocols)
- ✅ HTML Parsing (title, meta description, H1, images, word count, happy path, failure cases)
- ✅ Controller endpoints (happy path, all error cases)
- ✅ Service layer (audit flow, error handling)

### Frontend Tests (Node.js Test Runner + Cheerio)
```bash
# Run unit tests
npm test

# Typecheck TypeScript
npm run typecheck
```

---

## 🚢 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import in Vercel
3. Set `NEXT_PUBLIC_API_URL` to your backend URL
4. Deploy

### Backend (Render)
1. Create Web Service on Render
2. Connect repository
3. Build: `cd backend && mvn clean package -DskipTests`
4. Start: `java -jar backend/target/page-pulse-backend-1.0.0.jar`
5. Add MySQL database
6. Set environment variables:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `APP_CORS_ALLOWED_ORIGINS`

### CORS Configuration
Update `app.cors.allowed-origins` in `application.properties` with your frontend domain.

---

## 🧠 Three Design Decisions

### 1. Jsoup for HTML Parsing
Jsoup was chosen for the Spring Boot backend because it provides a clean jQuery-like API for HTML parsing, handles malformed HTML gracefully, and is specifically designed for server-side HTML manipulation. It's lightweight, fast, and doesn't require a full browser engine.

### 2. Custom Exception Hierarchy
The application defines specific exception classes (InvalidUrlException, ConnectionTimeoutException, SslException, etc.) that map to appropriate HTTP status codes. The GlobalExceptionHandler ensures consistent JSON error responses across all endpoints, never exposing stack traces to clients.

### 3. Dual Backend Support
The frontend supports both Next.js API routes (with PostgreSQL/Drizzle) and a separate Spring Boot backend (with MySQL). This flexibility allows:
- Quick development with Next.js full-stack
- Enterprise deployment with Spring Boot + MySQL
- Easy migration between architectures

---

## 🔮 Future Improvements

- **Lighthouse Integration** — Full performance, accessibility, SEO scoring
- **PDF Report Export** — Generate downloadable PDF reports
- **Bulk URL Auditing** — Audit multiple URLs at once
- **Scheduled Audits** — Recurring checks with email alerts
- **Link Checker** — Detect broken links
- **Performance History** — Track metrics over time with charts
- **Authentication** — User accounts to save audits
- **Webhook Notifications** — Send results to Slack/Discord
- **Browser Extension** — One-click audit
- **API Rate Limiting** — Protect against abuse

---

## 📄 License

MIT

---

Built for [Digital Heroes](https://digitalheroesco.com) Training Task ❤️
