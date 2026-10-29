-- ============================================================================
-- StreakHabit Database Schema (PostgreSQL 14+)
-- Duolingo-inspired Streak, Habit & Task Duration Tracking System
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    gems INTEGER NOT NULL DEFAULT 50, -- Currency to buy streak freeze shields
    streak_freezes_available INTEGER NOT NULL DEFAULT 2, -- Duolingo-style freeze shields
    notifications_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    notification_time VARCHAR(20) DEFAULT '20:00',
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Habits Table
CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'General', -- Health, Coding, Reading, Mindset, Fitness
    target_duration_mins INTEGER DEFAULT 15, -- Optional target time
    frequency VARCHAR(20) NOT NULL DEFAULT 'daily', -- daily, weekdays, weekends
    icon VARCHAR(50) DEFAULT 'flame',
    color VARCHAR(30) DEFAULT '#F59E0B', -- hex color code
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Daily Habit Completion Logs
CREATE TABLE IF NOT EXISTS habit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT TRUE,
    duration_minutes INTEGER DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 15,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_habit_daily_log UNIQUE (habit_id, log_date)
);

-- 4. Tasks Table (With direct completion & duration tracking)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'Work',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- low, medium, high
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed
    estimated_duration_mins INTEGER DEFAULT 25,
    actual_duration_seconds INTEGER DEFAULT 0, -- Total tracked time in seconds
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Task Time Logs (Detailed stopwatch / timer focus sessions)
CREATE TABLE IF NOT EXISTS task_time_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds >= 0),
    session_type VARCHAR(30) NOT NULL DEFAULT 'stopwatch', -- stopwatch, pomodoro, manual
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Streaks Tracking (Global Streak & Per-Habit Streaks)
CREATE TABLE IF NOT EXISTS user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    streak_type VARCHAR(20) NOT NULL DEFAULT 'global', -- 'global' or 'habit'
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    streak_freeze_used_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_streak_type UNIQUE (user_id, streak_type, habit_id)
);

-- 7. Duolingo-style Streak Milestones & Badges
CREATE TABLE IF NOT EXISTS streak_milestones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    streak_days INTEGER NOT NULL UNIQUE,
    badge_icon VARCHAR(50) NOT NULL,
    xp_bonus INTEGER NOT NULL DEFAULT 100,
    gems_reward INTEGER NOT NULL DEFAULT 20,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_milestone_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    milestone_id INTEGER NOT NULL REFERENCES streak_milestones(id) ON DELETE CASCADE,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_milestone UNIQUE (user_id, milestone_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date ON habit_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_task_time_logs_task ON task_time_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user ON user_streaks(user_id);

-- Seed Milestones
INSERT INTO streak_milestones (name, streak_days, badge_icon, xp_bonus, gems_reward, description)
VALUES 
    ('Flame Ignited', 3, 'spark', 50, 10, 'Completed habits 3 days in a row!'),
    ('Week Warrior', 7, 'fire', 150, 25, 'Unstoppable! 7 full days of daily consistency.'),
    ('Fortnight Master', 14, 'blaze', 350, 50, '14 continuous days! Habit is becoming second nature.'),
    ('Monthly Legend', 30, 'crown', 1000, 100, '30 days streak! You are in the top 1% of achievers.'),
    ('Century Titan', 100, 'trophy', 5000, 500, '100 days of absolute discipline and mastery.')
ON CONFLICT (streak_days) DO NOTHING;

-- Seed Default Demo User
INSERT INTO users (id, username, email, password_hash, display_name, xp, level, gems, streak_freezes_available, notifications_enabled)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'streak_master',
    'alex@streakhabit.app',
    'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec', -- password123 (sha512/salted)
    'Alex Rivera',
    840,
    4,
    120,
    2,
    TRUE
) ON CONFLICT (username) DO NOTHING;

-- Seed Default Habits
INSERT INTO habits (id, user_id, title, description, category, target_duration_mins, icon, color)
VALUES
    ('b1111111-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Morning Workout & Stretch', 'Full body mobility and light cardio', 'Fitness', 30, 'activity', '#EF4444'),
    ('b2222222-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Deep Focus Coding', 'Algorithms, fullstack project development', 'Coding', 45, 'code', '#3B82F6'),
    ('b3333333-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Read 15 Pages', 'Technical books or non-fiction personal growth', 'Learning', 20, 'book-open', '#10B981'),
    ('b4444444-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Evening Mindfulness Meditation', 'Calm breathing and mental reset', 'Mindset', 10, 'smile', '#8B5CF6')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Stored Procedures & Streak Calculation Engine
-- ============================================================================

CREATE OR REPLACE FUNCTION update_streak_on_habit_completion()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_today DATE;
    v_yesterday DATE;
    v_curr_streak INTEGER;
    v_longest_streak INTEGER;
    v_last_date DATE;
    v_freeze_count INTEGER;
BEGIN
    v_user_id := NEW.user_id;
    v_today := NEW.log_date;
    v_yesterday := v_today - INTERVAL '1 day';

    -- Retrieve or initialize global streak record
    SELECT current_streak, longest_streak, last_activity_date
    INTO v_curr_streak, v_longest_streak, v_last_date
    FROM user_streaks
    WHERE user_id = v_user_id AND streak_type = 'global' AND habit_id IS NULL;

    IF NOT FOUND THEN
        INSERT INTO user_streaks (user_id, streak_type, habit_id, current_streak, longest_streak, last_activity_date)
        VALUES (v_user_id, 'global', NULL, 1, 1, v_today);
    ELSE
        -- If already completed today, streak count stays same
        IF v_last_date = v_today THEN
            -- No increment needed
            RETURN NEW;
        -- If completed yesterday, increment streak
        ELSIF v_last_date = v_yesterday THEN
            v_curr_streak := v_curr_streak + 1;
            IF v_curr_streak > v_longest_streak THEN
                v_longest_streak := v_curr_streak;
            END IF;
            UPDATE user_streaks
            SET current_streak = v_curr_streak,
                longest_streak = v_longest_streak,
                last_activity_date = v_today,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = v_user_id AND streak_type = 'global' AND habit_id IS NULL;
        -- If missed days: check streak freeze protection
        ELSE
            SELECT streak_freezes_available INTO v_freeze_count FROM users WHERE id = v_user_id;
            
            -- If last active 2 days ago and has freeze available, consume freeze!
            IF v_last_date = (v_today - INTERVAL '2 days') AND v_freeze_count > 0 THEN
                UPDATE users SET streak_freezes_available = streak_freezes_available - 1 WHERE id = v_user_id;
                v_curr_streak := v_curr_streak + 1;
                IF v_curr_streak > v_longest_streak THEN v_longest_streak := v_curr_streak; END IF;
                UPDATE user_streaks
                SET current_streak = v_curr_streak,
                    longest_streak = v_longest_streak,
                    last_activity_date = v_today,
                    streak_freeze_used_date = v_yesterday,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = v_user_id AND streak_type = 'global' AND habit_id IS NULL;
            ELSE
                -- Streak reset to 1
                UPDATE user_streaks
                SET current_streak = 1,
                    last_activity_date = v_today,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = v_user_id AND streak_type = 'global' AND habit_id IS NULL;
            END IF;
        END IF;
    END IF;

    -- Add XP to user profile
    UPDATE users
    SET xp = xp + NEW.xp_earned,
        level = FLOOR(1 + SQRT((xp + NEW.xp_earned) / 100.0)),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = v_user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute streak recalculation
DROP TRIGGER IF EXISTS trg_habit_log_streak ON habit_logs;
CREATE TRIGGER trg_habit_log_streak
AFTER INSERT ON habit_logs
FOR EACH ROW
WHEN (NEW.completed = TRUE)
EXECUTE FUNCTION update_streak_on_habit_completion();

-- 8. Notes & Reflections Table
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150),
    content TEXT NOT NULL,
    tag VARCHAR(50) NOT NULL DEFAULT 'Reflection',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    linked_habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
    linked_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id, is_pinned DESC, created_at DESC);
