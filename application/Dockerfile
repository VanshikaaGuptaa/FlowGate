# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn clean package -DskipTests -q

# ── Stage 2: Run ──────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN addgroup -S flowgate && adduser -S flowgate -G flowgate

COPY --from=builder /app/target/*.jar app.jar

RUN chown flowgate:flowgate app.jar
USER flowgate

EXPOSE 8080

ENTRYPOINT ["java", "-Xmx300m", "-jar", "app.jar"]
