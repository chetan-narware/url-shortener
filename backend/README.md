# 🚀 Shortify – Backend

Production-ready URL Shortener backend built with Node.js, TypeScript, PostgreSQL, Redis, and Prisma.

This backend handles:

- User authentication (JWT-based)
- URL shortening
- Expiry handling
- Click tracking
- Analytics aggregation
- Redis caching
- Rate limiting & security middleware
- Dockerized infrastructure

---

# 🛠 Tech Stack

### Core
- Node.js 20
- TypeScript (ESM, NodeNext)
- Express 5

### Database
- PostgreSQL 16
- Prisma ORM

### Caching
- Redis 7
- Cache-Aside pattern

### Authentication
- JWT
- bcrypt

### Infrastructure
- Docker
- Docker Compose

### Security & Middleware
- Helmet
- CORS
- Morgan
- express-rate-limit

---

# 🏗 System Architecture


Client
↓
Express Controllers
↓
Service Layer (Business Logic)
↓
Repository Layer (Prisma)
↓
PostgreSQL (Source of Truth)

Redis sits between Service Layer and Database
for caching shortCode → longUrl lookups.


---

# 📂 Project Structure

### 🔹 `src/app.ts`
Express app configuration and middleware setup.

### 🔹 `src/index.ts`
Server entry point.

---

## 🔐 Authentication Module (`modules/auth`)

- `auth.controller.ts`
- `auth.service.ts`
- `auth.repository.ts`
- `auth.middleware.ts`
- `auth.routes.ts`

### Features:
- User registration
- Password hashing with bcrypt
- Login validation
- JWT generation
- Route protection middleware

---

## 🔗 URL Module (`modules/url`)

- URL creation
- Short code generation (nanoid)
- Expiry handling
- Click counting
- Redirect handling
- Cache invalidation

### Redirect Flow

1. Check Redis cache
2. If cache hit → return long URL
3. If cache miss:
   - Query database
   - Validate expiry
   - Cache result (TTL: 1 hour)
4. Log click
5. Increment clickCount
6. 302 Redirect

---

## 📊 Analytics Module (`modules/analytics`)

- Aggregates total clicks
- Groups clicks by date
- Computes user-level URL statistics

### Endpoint:


GET /api/analytics/:shortCode
GET /api/analytics/user


Returns:

- Total clicks
- Clicks grouped by day
- URL metadata

---

# 🗃 Database Schema

## User
- id
- email (unique)
- passwordHash
- createdAt

## Url
- id
- shortCode (unique)
- longUrl
- clickCount
- expiryDate
- createdAt
- userId (optional FK)

Indexes:
- shortCode
- userId
- createdAt

## Click
- id
- ipAddress
- userAgent
- createdAt
- urlId (FK, cascade delete)

Indexes:
- urlId
- createdAt

---

# ⚡ Caching Strategy

### Pattern Used:
Cache-Aside (Lazy Loading)

### Why?
- Simplicity
- Predictable invalidation
- Suitable for read-heavy workloads

### TTL:
1 hour

### Invalidation:
On URL deletion → `redis.del(shortCode)`

---

# 🔐 Security Measures

- Helmet for secure HTTP headers
- CORS configuration
- Rate limiting (100 req / 15 min)
- Password hashing with bcrypt
- JWT verification middleware
- Global error handling
- 404 route fallback

---

# 🧠 Design Decisions

### Why Layered Architecture?

Controller → Service → Repository

- Clear separation of concerns
- Testability
- Scalability
- Easier feature extension

---

### Why Redis?

Short URLs are read-heavy.

Redis reduces:
- Database load
- Latency
- Repeated lookups

---

### Why Click Table Instead of Only clickCount?

Allows:
- Time-based analytics
- Future geo/IP analytics
- Advanced reporting

---

# 🐳 Docker Setup

Services:

- PostgreSQL (5432)
- Redis (6379)

Volumes:
- postgres_data
- redis_data

Start everything:

```bash
docker-compose up -d
🚀 Running Locally
1️⃣ Install dependencies
npm install
2️⃣ Setup environment

Create .env:

DATABASE_URL=postgresql://user:pass@localhost:5432/url_shortener
JWT_SECRET=your_secret
PORT=3000
REDIS_URL=redis://localhost:6379
BASE_URL=http://localhost:3000
3️⃣ Run migrations
npx prisma migrate dev
4️⃣ Start server
npm run dev

Server runs at:

http://localhost:3000
```
📈 Scalability Considerations
---
Redis reduces database load

Indexed shortCode lookup

Cascade deletes prevent orphan data

Modular architecture supports microservice split

Stateless JWT auth enables horizontal scaling

🔮 Future Improvements
---
Rate limiting per user

Click geo-location analytics

URL custom aliases

URL edit capability

Soft deletes

Background analytics aggregation

Monitoring (Prometheus / Grafana)

📌 Author
---
Chetan Narware
---
