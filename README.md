# 🌐 Remote Work Collaboration Platform

A microservices-based platform that enables remote teams to collaborate effectively with real-time communication, task management, file sharing, and notifications.

## 🏗️ Tech Stack
**Frontend:**
- React.js
- Redux Toolkit
- Tailwind CSS

**Backend:**
- Spring Boot Microservices
- Kafka for inter-service communication
- PostgreSQL / MySQL
- WebSocket for real-time chat
- Docker for containerization

## 🧱 Microservices
- **Auth Service** – JWT authentication & authorization
- **User Service** – User profiles & management
- **Team Service** – Team creation, membership, and roles
- **Task Service** – Task assignment and tracking
- **Chat Service** – Direct & team messaging (WebSocket)
- **File Service** – File sharing system
- **Notification Service** – Real-time notifications
- **Common Lib** – Shared components (e.g., JWT utils, DTOs)

## ⚙️ Running Locally
```bash
# Backend (example)
cd backend/auth-service
mvn spring-boot:run

# Frontend
cd frontend/react-app
npm install
npm start
