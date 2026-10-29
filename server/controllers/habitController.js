const db = require('../db');

// Get all habits with today's completion status and calculated streaks
exports.getHabits = async (req, res) => {
  try {
    const userId = req.query.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const today = new Date().toISOString().split('T')[0];

    const habitsQuery = `
      SELECT 
        h.id,
        h.title,
        h.description,
        h.category,
        h.target_duration_mins,
        h.frequency,
        h.icon,
        h.color,
        h.is_active,
        COALESCE(hl.completed, false) as completed_today,
        hl.duration_minutes as time_spent_today,
        COALESCE(us.current_streak, 0) as current_streak,
        COALESCE(us.longest_streak, 0) as longest_streak
      FROM habits h
      LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND hl.log_date = $2
      LEFT JOIN user_streaks us ON us.habit_id = h.id AND us.user_id = $1
      WHERE h.user_id = $1 AND h.is_active = TRUE
      ORDER BY h.created_at ASC
    `;

    const { rows } = await db.query(habitsQuery, [userId, today]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Create a new habit
exports.createHabit = async (req, res) => {
  try {
    const userId = req.body.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const { title, description, category, target_duration_mins, frequency, icon, color } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Habit title is required' });
    }

    const query = `
      INSERT INTO habits (user_id, title, description, category, target_duration_mins, frequency, icon, color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      userId,
      title.trim(),
      description || '',
      category || 'General',
      target_duration_mins || 15,
      frequency || 'daily',
      icon || 'flame',
      color || '#F59E0B'
    ];

    const { rows } = await db.query(query, values);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Toggle habit completion for a specific date
exports.toggleHabitCompletion = async (req, res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const userId = req.body.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const date = req.body.date || new Date().toISOString().split('T')[0];
    const durationMinutes = req.body.durationMinutes || 0;

    // Check current log
    const checkQuery = `SELECT id, completed FROM habit_logs WHERE habit_id = $1 AND log_date = $2`;
    const checkRes = await client.query(checkQuery, [id, date]);

    let completedStatus = true;
    let xpEarned = 20;

    if (checkRes.rows.length > 0) {
      completedStatus = !checkRes.rows[0].completed;
      await client.query(
        `UPDATE habit_logs 
         SET completed = $1, duration_minutes = $2, updated_at = CURRENT_TIMESTAMP 
         WHERE habit_id = $3 AND log_date = $4`,
        [completedStatus, durationMinutes, id, date]
      );
    } else {
      await client.query(
        `INSERT INTO habit_logs (habit_id, user_id, log_date, completed, duration_minutes, xp_earned)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, userId, date, true, durationMinutes, xpEarned]
      );
    }

    await client.query('COMMIT');
    res.json({
      success: true,
      data: {
        habit_id: id,
        date,
        completed: completedStatus,
        xp_earned: completedStatus ? xpEarned : 0
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error toggling habit completion:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

// Delete habit
exports.deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`UPDATE habits SET is_active = FALSE WHERE id = $1`, [id]);
    res.json({ success: true, message: 'Habit archived successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
