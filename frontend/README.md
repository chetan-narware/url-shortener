# 🚀 Shortify – Frontend

Frontend for the URL Shortener application built with React + TypeScript + Vite.

This frontend provides:

- Authentication (Register / Login)
- Protected dashboard
- URL creation
- Analytics dashboard with charts
- Dark mode UI

---

## 🛠 Tech Stack

- React 18
- TypeScript
- Vite
- Axios
- React Router
- Tailwind CSS
- Recharts (Analytics visualization)

---

## 🏗 Architecture Overview


Browser
↓
React (Vite)
↓
Axios (JWT Interceptor)
↓
Backend API


### Authentication Flow

1. User logs in
2. Backend returns JWT
3. JWT stored in localStorage
4. Axios interceptor attaches token automatically
5. Protected routes validate authentication

---

## 📂 Folder Structure


src/
│
├── api/
│ └── axios.ts
│
├── components/
│ ├── Navbar.tsx
│ └── ProtectedRoute.tsx
│
├── context/
│ └── AuthContext.tsx
│
├── hooks/
│ └── useAuth.ts
│
├── pages/
│ ├── Home.tsx
│ ├── Login.tsx
│ ├── Register.tsx
│ ├── Dashboard.tsx
│ └── Analytics.tsx
│
├── App.tsx
└── main.tsx


---

## 🔐 Authentication Design

- Centralized AuthContext
- JWT stored in localStorage
- Axios request interceptor attaches `Authorization: Bearer <token>`
- Axios response interceptor handles 401
- ProtectedRoute guards private pages

---

## 📊 Analytics Features

Analytics page includes:

- Total clicks
- Average clicks per day
- Peak performing day
- Line chart (trend)
- Area chart
- Bar chart (daily distribution)

Data is fetched from:


GET /api/analytics/:shortCode


---

## 🚀 Running Locally

### 1️⃣ Install dependencies

```bash
npm install
2️⃣ Start development server
npm run dev

App runs at:

http://localhost:5173
⚙️ Environment Configuration

Frontend expects backend at:

http://localhost:3000/api

You can change base URL inside:

src/api/axios.ts
🏗 Production Build
npm run build

Output folder:

dist/