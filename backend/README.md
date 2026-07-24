# Page Pulse Backend

Spring Boot 3 backend for the Page Pulse website audit tool.

## Requirements

- Java 21
- Maven 3.8+
- MySQL 8.0+

## Quick Start

### 1. Setup MySQL Database

```sql
CREATE DATABASE page_pulse_db;
```

### 2. Configure Database Connection

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/page_pulse_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Run the Application

Using Maven:

```bash
mvn spring-boot:run
```

Or build and run the JAR:

```bash
mvn clean package
java -jar target/page-pulse-backend-1.0.0.jar
```

The server starts at `http://localhost:8080`

## API Endpoints

### POST /api/audit

Audit a website URL.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
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

### GET /api/history

Get recent audit history.

### GET /api/health

Health check endpoint.

## Running Tests

```bash
mvn test
```

## Project Structure

```
src/main/java/com/pagepulse/
├── PagePulseApplication.java    # Main entry point
├── config/                      # Configuration classes
├── controller/                  # REST controllers
├── dto/                         # Data transfer objects
├── entity/                      # JPA entities
├── exception/                   # Custom exceptions & handlers
├── repository/                  # JPA repositories
├── service/                     # Business logic
│   └── impl/                    # Service implementations
├── util/                        # Utility classes
└── validation/                  # Validation utilities
```

## IntelliJ IDEA Setup

1. Open IntelliJ IDEA
2. File → Open → Select the `backend` folder
3. Wait for Maven to download dependencies
4. Run `PagePulseApplication.java`

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | MySQL connection URL | `jdbc:mysql://localhost:3306/page_pulse_db` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `root` |
| `APP_CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |

### CORS Configuration

Update `app.cors.allowed-origins` in application.properties to add your frontend URLs.

## Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your repository
3. Set build command: `mvn clean package -DskipTests`
4. Set start command: `java -jar target/page-pulse-backend-1.0.0.jar`
5. Add environment variables for database connection
