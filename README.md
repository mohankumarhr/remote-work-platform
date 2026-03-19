# 🌐 Remote Work Collaboration Platform

A microservices-based platform that enables remote teams to collaborate effectively with real-time communication, task management, and scalable architecture.

---

## 🚀 Live Demo
[Live Demo](https://teamweave.netlify.app/)

---

## 🏗️ Tech Stack

### **Frontend**
- React.js
- Redux Toolkit
- Tailwind CSS

### **Backend**
- Spring Boot Microservices
- Apache Kafka (Event-driven communication)
- MySQL (Aiven)
- WebSocket (Real-time chat)
- Docker (Containerization)

### **Infrastructure**
- AWS EC2
- Nginx API Gateway
- GitHub Actions (CI/CD)

---

## 🧱 Microservices

- **Auth Service** – JWT authentication & authorization
- **User Service** – User profiles & management
- **Team Service** – Team creation, membership, and roles
- **Task Service** – Task assignment and tracking
- **Chat Service** – Real-time messaging using WebSockets
- **Call Service** – Video call & meeting management
- **Common Lib** – Shared authentication & utility components

---

[//]: # (## 🧠 Architecture Diagram)

[//]: # ()
[//]: # (![Architecture Diagram]&#40;./docs/architecture.png&#41;)

[//]: # ()
[//]: # (> Shows frontend → API Gateway → microservices → Kafka → database → deployment flow)

[//]: # ()
[//]: # (---)

[//]: # ()
[//]: # (## 🗄️ ER Diagram)

[//]: # ()
[//]: # (![ER Diagram]&#40;./docs/er-diagram.png&#41;)

[//]: # ()
[//]: # (> Represents entities like Users, Teams, Tasks, ChatMessages, and their relationships)

[//]: # ()
[//]: # (---)

## ⚙️ Running Locally

### Backend
```bash
cd backend/auth-service
mvn spring-boot:run