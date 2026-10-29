const crypto = require('crypto');
const db = require('../db');

// Hash password with SHA256 and salt
function hashPassword(password) {
  const salt = 'streak_habit_salt_2026';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, notifications_enabled } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, error: 'Full name is required' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email is required' });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({ success: false, error: 'Password must be at least 4 characters' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const displayName = name.trim();
    // Auto-generate username from email
    const username = trimmedEmail.split('@')[0] + '_' + Math.floor(Math.random() * 1000);
    const passwordHash = hashPassword(password);

    // Check if user already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [trimmedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }

    // Insert new user with starter points (XP 50, Level 1, Gems 60, Freezes 2)
    const insertQuery = `
      INSERT INTO users (username, email, password_hash, display_name, xp, level, gems, streak_freezes_available, notifications_enabled)
      VALUES ($1, $2, $3, $4, 50, 1, 60, 2, $5)
      RETURNING id, username, email, display_name, xp, level, gems, streak_freezes_available, notifications_enabled, created_at
    `;
    const userRes = await db.query(insertQuery, [
      username,
      trimmedEmail,
      passwordHash,
      displayName,
      !!notifications_enabled,
    ]);

    const newUser = userRes.rows[0];

    // Initialize global streak row for this user
    await db.query(
      `INSERT INTO user_streaks (user_id, streak_type, habit_id, current_streak, longest_streak, last_activity_date)
       VALUES ($1, 'global', NULL, 1, 1, CURRENT_DATE)
       ON CONFLICT DO NOTHING`,
      [newUser.id]
    );

    // Seed starter habits for the new user
    const habitQuery = `
      INSERT INTO habits (user_id, title, description, category, target_duration_mins, icon, color)
      VALUES 
        ($1, 'Morning Stretch & Hydrate', 'Wake up body and drink 500ml water', 'Fitness', 15, 'activity', '#EF4444'),
        ($1, 'Deep Focus Session', 'Uninterrupted creative or coding work', 'Coding', 30, 'code', '#3B82F6'),
        ($1, 'Read 10 Pages', 'Non-fiction personal growth reading', 'Learning', 15, 'book-open', '#10B981')
    `;
    await db.query(habitQuery, [newUser.id]);

    res.status(201).json({
      success: true,
      message: 'User registered successfully with saved starter points',
      data: {
        id: newUser.id,
        name: newUser.display_name,
        email: newUser.email,
        username: newUser.username,
        notifications_enabled: newUser.notifications_enabled,
        profile: {
          streak: 1,
          longestStreak: 1,
          xp: newUser.xp,
          level: newUser.level,
          gems: newUser.gems,
          freezes: newUser.streak_freezes_available,
        },
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, error: 'Registration failed. Server error.' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const trimmed = email.trim().toLowerCase();
    const passwordHash = hashPassword(password);

    // Find user
    const userRes = await db.query(
      `SELECT * FROM users WHERE email = $1 OR username = $1`,
      [trimmed]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'No account found with this email or username' });
    }

    const user = userRes.rows[0];

    // Check password if stored, or allow demo user password check
    if (user.password_hash && user.password_hash !== passwordHash) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Please try again.' });
    }

    // Get streak data
    const streakRes = await db.query(
      `SELECT current_streak, longest_streak FROM user_streaks WHERE user_id = $1 AND streak_type = 'global' AND habit_id IS NULL`,
      [user.id]
    );
    const streakData = streakRes.rows[0] || { current_streak: 1, longest_streak: 1 };

    res.json({
      success: true,
      message: 'Login successful. Points and progress restored.',
      data: {
        id: user.id,
        name: user.display_name,
        email: user.email,
        username: user.username,
        notifications_enabled: user.notifications_enabled,
        profile: {
          streak: streakData.current_streak,
          longestStreak: streakData.longest_streak,
          xp: user.xp,
          level: user.level,
          gems: user.gems,
          freezes: user.streak_freezes_available,
        },
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Login failed. Server error.' });
  }
};

// Get current authenticated user profile
exports.getMe = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.query.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    const userRes = await db.query(
      `SELECT id, username, email, display_name, xp, level, gems, streak_freezes_available, notifications_enabled, created_at FROM users WHERE id = $1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = userRes.rows[0];
    const streakRes = await db.query(
      `SELECT current_streak, longest_streak FROM user_streaks WHERE user_id = $1 AND streak_type = 'global' AND habit_id IS NULL`,
      [user.id]
    );
    const streakData = streakRes.rows[0] || { current_streak: 1, longest_streak: 1 };

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.display_name,
        email: user.email,
        username: user.username,
        notifications_enabled: user.notifications_enabled,
        profile: {
          streak: streakData.current_streak,
          longestStreak: streakData.longest_streak,
          xp: user.xp,
          level: user.level,
          gems: user.gems,
          freezes: user.streak_freezes_available,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update user points and profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const { xp, level, gems, freezes, notifications_enabled, name } = req.body;

    const query = `
      UPDATE users
      SET xp = COALESCE($1, xp),
          level = COALESCE($2, level),
          gems = COALESCE($3, gems),
          streak_freezes_available = COALESCE($4, streak_freezes_available),
          notifications_enabled = COALESCE($5, notifications_enabled),
          display_name = COALESCE($6, display_name),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, display_name, xp, level, gems, streak_freezes_available, notifications_enabled
    `;

    const { rows } = await db.query(query, [
      xp,
      level,
      gems,
      freezes,
      notifications_enabled,
      name,
      userId,
    ]);

    res.json({
      success: true,
      message: 'Points and profile saved successfully',
      data: rows[0],
    });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};
