# ---------- Build Stage ----------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# ---------- Runtime Stage ----------
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/page-pulse-backend-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-Dserver.port=${PORT:-8080}","-jar","app.jar"]