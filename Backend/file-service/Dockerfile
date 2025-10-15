# ===============================
# Stage 1: Build the application
# ===============================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

ARG MAVEN_OPTS
ENV MAVEN_OPTS=$MAVEN_OPTS

# Copy pom.xml and download dependencies first (for caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# ===============================
# Stage 2: Run the application
# ===============================
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the service port
EXPOSE 8086

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
