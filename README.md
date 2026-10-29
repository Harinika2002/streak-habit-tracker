# 🔥 StreakHabit — Duolingo-Style Habit & Task Duration Tracker

A full-stack habit tracking and task duration productivity platform built with **React**, **Node.js (Express)**, and **PostgreSQL**, inspired by Duolingo's viral streak and gamification mechanics.

---

## ✨ Core Features

1. **Duolingo-Style Streak System**:
   - Animated glowing flame tiers (Ember -> Flame -> Blaze -> Inferno -> Supernova).
   - Streak freeze shields (`streak_freezes_available`) that protect your streak if you miss a day.
   - Milestone badges (3-day, 7-day, 14-day, 30-day, 100-day) with XP & Gem rewards.
   - Live daily countdown timer showing time remaining before midnight to maintain the streak.

2. **Daily Habit Tracker**:
   - Check off daily habits across categories (Fitness, Coding, Learning, Mindset).
   - Individual consecutive streak tracking per habit.
   - Instant XP points (+20 XP) and celebration sounds.

3. **Task Completion & Duration Stopwatch**:
   - Live focus stopwatch and preset timer (15m, 25m Pomodoro, 45m).
   - Records exact time spent (`duration_seconds`) on every task.
   - Duration analytics: Today's focused minutes, weekly total, and category breakdown.

4. **Gamification & Motivation**:
   - Duolingo-style mascot ("Ignis") offering witty voice lines and proactive motivation.
   - In-app Streak Freeze shop: buy freeze shields with earned gems.
   - Interactive sound synthesizer (Web Audio API) and celebratory confetti.

5. **Authentication & Points Preservation**:
   - Sign up with **Full Name**, **Email**, and **Password**.
   - Profile management with customizable avatar and account details.
   - **Safe Points Guarantee**: All earned XP points, level, gems, and streaks are securely saved to the user account and restored automatically when logging in, even across logouts.
   - User profile modal with stats breakdown and safe logout.

6. **Web Notification System**:
   - Browser notification permission request with motivational Ignis coach prompt.
   - Daily 8:00 PM streak preservation reminders before midnight reset.
   - Real-time focus stopwatch / Pomodoro completion desktop chime and notifications.
   - Notification center in header with "Send Test Notification" trigger.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Web Audio API.
- **Backend**: Node.js, Express REST API, CORS, Morgan logger.
- **Database**: PostgreSQL 14+ with custom stored procedures (`update_streak_on_habit_completion`), triggers, and relational constraints.
- **DevOps**: Docker Compose for single-command orchestration.

---

## 🚀 Quick Start Guide

### Option 1: Run with Docker Compose (Recommended)

```bash
docker compose up --build
```
- Web Client: http://localhost:3000
- API Server: http://localhost:5000
- PostgreSQL: `localhost:5432` (DB: `streakhabit_db`)

### Option 2: Local Development Setup

1. **Start PostgreSQL**:
   Make sure PostgreSQL is running, then run `server/db/schema.sql` to initialize tables, triggers, and seed data.

2. **Start Backend Server**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Start React Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register with name, email, and password |
| `POST` | `/api/auth/login` | Login and restore saved points, streaks & habits |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & points |
| `PUT` | `/api/auth/profile` | Update points, XP, gems, freezes, & notification settings |
| `GET` | `/api/streaks/status` | Current streak, flame tier, freeze shields, and milestones |
| `POST` | `/api/streaks/buy-freeze` | Purchase a streak freeze shield with 50 gems |
| `GET` | `/api/habits` | Get all user habits with today's completion status |
| `POST` | `/api/habits` | Create a new habit |
| `POST` | `/api/habits/:id/toggle` | Toggle habit completion & recalculate streak |
| `GET` | `/api/tasks` | Get tasks with duration logs and status |
| `POST` | `/api/tasks` | Create a new task |
| `POST` | `/api/tasks/:id/log-time` | Record duration in seconds & mark completed |
| `GET` | `/api/stats/summary` | 30-day habit heatmap and focus duration metrics |
