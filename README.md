# AI Exam

- `backend/`: Laravel 13 (fresh project)
- `frontend/`: React + Vite + Tailwind CSS + shadcn/ui + Font Awesome

## Backend

Needs PHP 8.3+ and Composer.

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve
```

Runs at http://localhost:8000

## Frontend

Needs Node.js 20.19+.

```bash
cd frontend
npm install
npm run dev
```

Runs at http://localhost:5173
