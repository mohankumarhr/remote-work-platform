# ===============================
# Stage 0: Build and install commonjwt
# ===============================
FROM maven:3.9.6-eclipse-temurin-17 AS common-lib-build
WORKDIR /app

# Copy commonjwt module (shared library)
COPY commonjwt/pom.xml ./pom.xml
COPY commonjwt/src ./src

# Install to local Maven repo inside the container
RUN mvn clean install -DskipTests


# ===============================
# Stage 1: Build the microservice
# ===============================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

ARG SERVICE_NAME
ARG MAVEN_OPTS
ENV MAVEN_OPTS=$MAVEN_OPTS

# Copy Maven repo from common-lib stage
COPY --from=common-lib-build /root/.m2 /root/.m2

# Copy service pom.xml and resolve dependencies
COPY ${SERVICE_NAME}/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy the service source code and build
COPY ${SERVICE_NAME}/src ./src
COPY ${SERVICE_NAME}/aiven-truststore.jks ./aiven-truststore.jks
RUN mvn clean package -DskipTests


# ===============================
# Stage 2: Run the microservice
# ===============================
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy built JAR file from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port (change if needed)
#ARG PORT=8080
#EXPOSE ${PORT}

COPY --from=build /app/aiven-truststore.jks aiven-truststore.jks

ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=$PORT"]
