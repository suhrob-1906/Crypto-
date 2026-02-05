# Crypto Exchange Simulator

A full-stack crypto exchange simulation built with Django (Backend) and React/Vite (Frontend).

## 🚀 Deployment Checklist (Final Steps)

### Phase 1: Prepare Services (Do this first)

1.  **Upstash (Redis)**:
    *   Go to your Database in Upstash Console.
    *   Look for the **"Connect"** button or "Python" tab.
    *   Copy the string that looks like: `redis://default:xxxxx@xxxxx.upstash.io:6379`.
    *   ❌ Do NOT use the `https://...` URL.
    *   ✅ SAVE this string for later.

2.  **Render (PostgreSQL)**:
    *   You already have `DATABASE_URL`. It looks correct.
    *   Format: `postgresql://user:pass@host/dbname`.

### Phase 2: Deploy Backend (Render)

1.  Push your latest code to GitHub.
2.  Go to your Render Web Service -> **Environment**.
3.  Add/Update these variables:
    *   `DATABASE_URL`: (Paste your postgresql url)
    *   `REDIS_URL`: (Paste your `redis://...` string from Phase 1)
    *   `SECRET_KEY`: (Any random long string)
    *   `DEBUG`: `0`
    *   `ALLOWED_HOSTS`: `*`
    *   `CORS_ALLOWED_ORIGINS`: `https://exchange-frontend.vercel.app` (You will update this later).
4.  **Save Changes**. Render will automatically redeploy.
5.  Check "Logs". Wait for "Build successful" and "Starting service".

### Phase 3: Deploy Frontend (Vercel)

1.  Go to Vercel -> Import Project -> Select `exchange-sim/frontend`.
2.  **Environment Variables**:
    *   `VITE_API_BASE_URL`: Paste your Render Backend URL (e.g., `https://exchange-sim.onrender.com`).
    *   ⚠️ **IMPORTANT**: No trailing slash `/` at the end.
    *   ✅ Correct: `https://my-app.onrender.com`
    *   ❌ Wrong: `https://my-app.onrender.com/`
3.  Click **Deploy**.

### Phase 4: Final Connection

1.  Copy your new Vercel Domain (e.g., `https://exchange-sim-frontend.vercel.app`).
2.  Go back to **Render** -> Environment.
3.  Update `CORS_ALLOWED_ORIGINS` with this Vercel domain.
4.  **Save**. Render restarts.

---

## Troubleshooting

- **WebSockets fail?** Check `REDIS_URL` starts with `redis://`.
- **Login fails?** Check `CORS_ALLOWED_ORIGINS` matches Vercel URL exactly.
- **White screen?** Check Console (F12) for errors.

---

## Local Development
*(See previous instructions for local run if needed)*
