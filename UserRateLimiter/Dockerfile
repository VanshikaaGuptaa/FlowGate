# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom first so dependency layer is cached
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -q

# ── Stage 2: Run ──────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S flowgate && adduser -S flowgate -G flowgate

COPY --from=builder /app/target/*.jar app.jar

RUN chown flowgate:flowgate app.jar
USER flowgate

EXPOSE 8000

ENTRYPOINT ["java", "-Xmx400m", "-jar", "app.jar"]
