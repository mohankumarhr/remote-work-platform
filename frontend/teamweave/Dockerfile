# ===============================
# Stage 1: Build Vite app
# ===============================
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Vite app for production
RUN npm run build
RUN ls -la dist

# ===============================
# Stage 2: Serve with Nginx
# ===============================
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx files
RUN rm -rf ./*

# Copy Vite build output
COPY --from=build /app/dist .

# Optional: custom Nginx config for SPA routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
