# Crypto Exchange Simulator

A full-stack crypto exchange simulation built with Django (Backend) and React/Vite (Frontend).

## Tech Stack

- **Backend**: Python, Django, Django REST Framework, Channels (WebSockets), Redis, PostgreSQL.
- **Frontend**: React, Vite, TailwindCSS, Lightweight Charts.
- **Deployment**: Ready for Render (Backend) and Vercel (Frontend).

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL
- Redis (optional for local dev, required for WebSockets)

## 🚀 Local Development Guide

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate
# Activate (Mac/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (create .env file)
# See settings.py for variables.
# Minimal:
# DEBUG=1
# SECRET_KEY=your_secret

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open http://localhost:5173 to view the app.

---

## 🌍 Deployment Guide

### Deployment Overview
- **Backend (API)**: Deployed on **Render** (Web Service).
- **Database**: PostgreSQL (provided by Render).
- **Redis**: Redis (provided by Render).
- **Frontend (UI)**: Deployed on **Vercel**.

### Step 1: Deploy Backend to Render

1.  Push your code to GitHub.
2.  Go to [dashboard.render.com](https://dashboard.render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repo.
5.  **Settings**:
    - **Root Directory**: `exchange-sim/backend`
    - **Runtime**: Python 3
    - **Build Command**: `./build.sh`
    - **Start Command**: `gunicorn config.wsgi`
6.  **Environment Variables** (Advanced):
    - `PYTHON_VERSION`: `3.10.0`
    - `SECRET_KEY`: (Generate one)
    - `DEBUG`: `0`
    - `ALLOWED_HOSTS`: `*` (or your domain)
    - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app` (add this AFTER deploying frontend)
7.  **Database**:
    - Create a **PostgreSQL** instance on Render.
    - Copy the `Internal Database URL`.
    - Add `DATABASE_URL` env var to your Web Service.
8.  **Redis**:
    - Create a **Redis** instance on Render.
    - Copy the `Internal Redis URL`.
    - Add `REDIS_URL` env var to your Web Service.

### Step 2: Deploy Frontend to Vercel

1.  Go to [vercel.com](https://vercel.com/).
2.  Add New **Project**.
3.  Import your GitHub repo.
4.  **Framework Preset**: Vite.
5.  **Root Directory**: `exchange-sim/frontend`.
6.  **Environment Variables**:
    - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com` (The URL from Step 1)
7.  Deploy.

### Step 3: Connect Frontend & Backend

1.  Go back to Render Web Service **Environment Variables**.
2.  Update `CORS_ALLOWED_ORIGINS` to include your new Vercel URL (e.g., `https://exchange-sim.vercel.app`).
3.  Redeploy Backend.

## Troubleshooting 400/CORS Errors

- **404 Not Found**: Check `VITE_API_BASE_URL` - it should NOT have a trailing slash.
- **CORS Error**: Ensure `CORS_ALLOWED_ORIGINS` in Render exactly matches your Vercel URL (no trailing slash).
- **500 Server Error**: Check Render logs. likely missing `DATABASE_URL` or migration failed.

