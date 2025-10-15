# ===============================
# Stage 1: Build React app
# ===============================
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the React app for production
RUN npm run build || (echo "❌ React build failed! Showing logs..." && cat /app/npm-debug.log || true && exit 1)
RUN ls -la

# ===============================
# Stage 2: Serve with Nginx
# ===============================
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy React build files to Nginx
COPY --from=build /app/dist .

# Copy custom Nginx configuration (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
