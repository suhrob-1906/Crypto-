# Environment Configuration

## Backend URL (ВАЖНО!)

Перед деплоем на Vercel, обновите файл `.env.production`:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

Замените `your-backend-url.onrender.com` на реальный URL вашего бэкенда на Render.

## Локальная разработка

Для локальной разработки создайте файл `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Vercel Environment Variables

В настройках проекта на Vercel добавьте переменную окружения:
- **Name**: `VITE_API_BASE_URL`
- **Value**: `https://your-backend-url.onrender.com`
