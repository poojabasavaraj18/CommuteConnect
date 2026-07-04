# 🚗 CommuteConnect

A full-stack carpool coordination platform that enables commuters to create ride posts, discover rides, express interest, and manage ride requests through a modern and responsive web application.

---

# 📖 Project Overview

CommuteConnect is a full-stack web application built to simplify daily commuting by connecting users traveling along similar routes. The application provides secure authentication, ride management, interest tracking, and a personalized dashboard, offering a seamless experience for commuters.

---

# 🏗 Architecture Diagram

```
                 +---------------------------+
                 |      Angular Frontend     |
                 |        (Netlify)          |
                 +------------+--------------+
                              |
                         REST API (HTTPS)
                              |
                              ▼
                 +---------------------------+
                 |      NestJS Backend       |
                 |        (Render)           |
                 +------------+--------------+
                              |
                          Prisma ORM
                              |
                              ▼
                 +---------------------------+
                 |    PostgreSQL Database    |
                 |         (Neon)            |
                 +---------------------------+
```

---

# 🗄 Database Schema

## User

| Field | Type |
|--------|------|
| id | UUID |
| name | String |
| email | String (Unique) |
| password | String (Hashed) |
| isActive | Boolean |
| createdAt | DateTime |

---

## Post

| Field | Type |
|--------|------|
| id | UUID |
| origin | String |
| destination | String |
| travelDate | Date |
| travelTime | String |
| availableSeats | Integer |
| notes | Text |
| status | ACTIVE / COMPLETED / CANCELLED |
| ownerId | UUID |

---

## Interest

| Field | Type |
|--------|------|
| id | UUID |
| senderId | UUID |
| receiverId | UUID |
| postId | UUID |
| status | PENDING / ACCEPTED / REJECTED |

---

# ✨ Features

### Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Encryption using bcrypt

### Dashboard

- Personalized Dashboard
- Ride Statistics
- Recent Ride Posts
- Recent Ride Interests

### Ride Management

- Create Ride
- View All Available Rides
- View My Posts
- Update Ride Status
- Seat Management

### Interest Management

- Send Ride Interest
- Accept Requests
- Reject Requests
- View Sent Interests
- View Received Interests

### Profile

- View Profile
- Update Profile

### Notifications

- Interest Notifications
- Request Status Updates


# 💻 Tech Stack

## Frontend

- Angular
- TypeScript
- Angular Material
- HTML5
- SCSS
- RxJS

## Backend

- NestJS
- TypeScript
- Prisma ORM
- JWT
- bcrypt

## Database

- PostgreSQL (Neon)

## Deployment

- Netlify
- Render

---

# 📂 Folder Structure

```
CommuteConnect
│
├── backend
│   ├── prisma
│   ├── src
│   │   ├── auth
│   │   ├── common
│   │   ├── dashboard
│   │   ├── interests
│   │   ├── notifications
│   │   ├── posts
│   │   ├── prisma
│   │   ├── users
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── test
│   ├── package.json
│   └── prisma
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── app
│   │   │   ├── core
│   │   │   ├── features
│   │   │   │   ├── auth
│   │   │   │   ├── dashboard
│   │   │   │   ├── interests
│   │   │   │   ├── notifications
│   │   │   │   ├── posts
│   │   │   │   └── profile
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   └── main.ts
│   │   ├── environments
│   │   ├── index.html
│   │   └── styles.scss
│   ├── angular.json
│   └── package.json
│
└── README.md
```

---

# ⚙️ Setup Instructions

## Clone Repository

```bash
git clone https://github.com/poojabasavaraj18/CommuteConnect.git

cd CommuteConnect
```

## Backend Setup

```bash
cd backend

npm install

npx prisma generate

npx prisma migrate dev

npm run start:dev
```

Backend runs at:

```
http://localhost:3000
```

---

## Frontend Setup

```bash
cd frontend

npm install

ng serve
```

Frontend runs at:

```
http://localhost:4200
```

---

# 🔐 Environment Variables

## Backend (.env)

```env
DATABASE_URL="postgresql://neondb_owner:npg_Y4OcpDGv0asS@ep-icy-shape-adeu6b2a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

JWT_SECRET="CommuteConnect@2026#NestJS$JWT"

FRONTEND_URL=http://localhost:4200

PORT=3000
```

## Frontend

Update the API URL inside the environment file.

Development

```ts
apiUrl = "http://localhost:3000";
```

Production

```ts
apiUrl = "https://commuteconnect.onrender.com";
```

---

# 🌐 Deployment Links

## Frontend

https://commuteconnectt.netlify.app

## Backend

https://commuteconnect.onrender.com

## GitHub Repository

https://github.com/poojabasavaraj18/CommuteConnect.git

---

# ⚙️ Technical Decisions

- Angular Standalone Components were used to simplify module management.
- NestJS provides a scalable backend architecture with dependency injection.
- Prisma ORM simplifies database operations and migrations.
- PostgreSQL was selected for relational data management.
- JWT Authentication secures all protected APIs.
- Angular Material provides a modern and consistent UI.
- REST APIs are used for communication between frontend and backend.
- Netlify hosts the frontend while Render hosts the backend.

---

# ⚖️ Trade-offs

- Real-time notifications were not implemented.
- Google Maps integration was excluded to keep the project scope manageable.
- In-app chat between commuters is not included.
- Profile image upload is not supported.
- Ride search currently uses basic filtering.

---

# 🚀 Future Implementations

- Google Maps Integration
- Live Ride Tracking
- WebSocket-based Real-time Notifications
- In-app Chat
- Email Notifications
- Ride Ratings & Reviews
- Profile Picture Upload
- Advanced Ride Search Filters
- Admin Dashboard
- Push Notifications
- Dark Mode
- Payment Integration
- Ride Analytics Dashboard