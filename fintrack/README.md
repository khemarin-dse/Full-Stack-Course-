# FinTrack — Personal Finance Tracking System

Full-stack web app built with **React + Vite** (frontend) and **Laravel** (backend) with **MySQL** database.

---

## Tech Stack

| Layer    | Tool                          |
|----------|-------------------------------|
| Frontend | React + Vite + Tailwind CSS   |
| Backend  | Laravel 10 (php artisan serve)|
| Database | MySQL                         |
| Auth     | Laravel Sanctum (token-based) |
| Charts   | Recharts                      |

---

## Prerequisites

Make sure these are installed on your machine:
- **PHP 8.1+** — `php -v`
- **Composer** — `composer -v`
- **Node.js 18+** — `node -v`
- **npm** — `npm -v`
- **MySQL** — running locally (port 3306)

---

## Setup Instructions

### Step 1 — Create the database

Open MySQL (or phpMyAdmin) and run:

```sql
CREATE DATABASE fintrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or run the provided SQL file:
```bash
mysql -u root -p < database/setup.sql
```

---

### Step 2 — Setup Backend (Laravel)

```bash
# Go into the backend folder
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env .env.backup

# Generate app key
php artisan key:generate

# Run database migrations (creates all tables)
php artisan migrate

# Seed the database with demo data (optional but recommended)
php artisan db:seed

# Start the Laravel server
php artisan serve
```

The backend will run at: **http://localhost:8000**

> If your MySQL password is not empty, open `backend/.env` and set:
> `DB_PASSWORD=your_password`

---

### Step 3 — Setup Frontend (React + Vite)

Open a **new terminal window**:

```bash
# Go into the frontend folder
cd frontend

# Install Node dependencies
npm install

# Start the Vite dev server
npm run dev
```

The frontend will run at: **http://localhost:3000**

---

## Demo Login

After seeding, you can log in with:

| Field    | Value             |
|----------|-------------------|
| Email    | khem@email.com    |
| Password | password123       |

---

## Project Structure

```
fintrack/
├── frontend/                  # React + Vite app
│   └── src/
│       ├── components/
│       │   ├── layout/        # Sidebar layout
│       │   ├── modals/        # All modal popups
│       │   └── ui/            # Reusable UI components
│       ├── context/           # Auth, Finance, Toast contexts
│       ├── pages/             # All pages (Dashboard, Transactions, etc.)
│       └── utils/             # API instance, category helpers
│
├── backend/                   # Laravel app
│   ├── app/
│   │   ├── Http/Controllers/  # All API controllers
│   │   └── Models/            # Eloquent models
│   ├── database/
│   │   ├── migrations/        # Table schemas
│   │   └── seeders/           # Demo data
│   └── routes/
│       └── api.php            # All API routes
│
└── database/
    └── setup.sql              # MySQL database creation script
```

---

## API Endpoints

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| POST   | /api/register             | Register new user            |
| POST   | /api/login                | Login                        |
| POST   | /api/logout               | Logout                       |
| GET    | /api/dashboard/summary    | Dashboard summary cards      |
| GET    | /api/dashboard/chart      | Chart data (bar + pie)       |
| GET    | /api/transactions         | List transactions            |
| POST   | /api/transactions         | Add transaction              |
| DELETE | /api/transactions/{id}    | Delete transaction           |
| GET    | /api/budgets              | List budgets for this month  |
| POST   | /api/budgets              | Set a budget                 |
| PUT    | /api/budgets/{id}         | Update budget                |
| DELETE | /api/budgets/{id}         | Delete budget                |
| GET    | /api/goals                | List all goals               |
| POST   | /api/goals                | Create a goal                |
| GET    | /api/goals/{id}           | Goal detail + history        |
| PUT    | /api/goals/{id}           | Update goal                  |
| DELETE | /api/goals/{id}           | Delete goal                  |
| POST   | /api/goals/{id}/add-money | Add money to goal            |
| GET    | /api/reports/summary      | Financial reports            |
| PUT    | /api/user/profile         | Update profile               |
| PUT    | /api/user/password        | Change password              |
| DELETE | /api/user/data            | Clear all data               |
| DELETE | /api/user/account         | Delete account               |

---

## Features

- ✅ Register & Login with JWT token auth (Laravel Sanctum)
- ✅ Dashboard with live summary cards and charts
- ✅ Add income/expense transactions
- ✅ Link income transactions to saving goals
- ✅ Monthly budget tracking per category with 80% warning alerts
- ✅ Goal tracking with saving history
- ✅ Add money directly to goals
- ✅ Financial reports with monthly breakdown
- ✅ Settings: update profile, change password, currency, notifications
- ✅ All data is per-user and fully secured

---

## Troubleshooting

**CORS error?**
Make sure `frontend` runs on port 3000 and `backend` on port 8000. Check `backend/config/cors.php`.

**DB connection error?**
Check `backend/.env` — set the correct `DB_USERNAME`, `DB_PASSWORD`, and `DB_DATABASE`.

**`php artisan migrate` fails?**
Make sure MySQL is running and the `fintrack` database exists.

**`composer install` fails?**
Make sure PHP 8.1+ is installed: `php -v`
