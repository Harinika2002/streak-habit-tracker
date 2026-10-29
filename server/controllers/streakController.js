const db = require('../db');

// Get user streak summary with Duolingo-style flame status & freeze shields
exports.getStreakStatus = async (req, res) => {
  try {
    const userId = req.query.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const today = new Date().toISOString().split('T')[0];

    // User data
    const userRes = await db.query(
      `SELECT xp, level, gems, streak_freezes_available, display_name FROM users WHERE id = $1`,
      [userId]
    );
    const user = userRes.rows[0] || { xp: 0, level: 1, gems: 0, streak_freezes_available: 2 };

    // Global streak
    const streakRes = await db.query(
      `SELECT current_streak, longest_streak, last_activity_date, streak_freeze_used_date 
       FROM user_streaks 
       WHERE user_id = $1 AND streak_type = 'global' AND habit_id IS NULL`,
      [userId]
    );

    const streakData = streakRes.rows[0] || { current_streak: 5, longest_streak: 12, last_activity_date: today };

    // Check habits completed today
    const habitCheckRes = await db.query(
      `SELECT COUNT(DISTINCT habit_id) as completed_count 
       FROM habit_logs 
       WHERE user_id = $1 AND log_date = $2 AND completed = TRUE`,
      [userId, today]
    );

    const totalHabitsRes = await db.query(
      `SELECT COUNT(*) as total_count FROM habits WHERE user_id = $1 AND is_active = TRUE`,
      [userId]
    );

    const completedToday = parseInt(habitCheckRes.rows[0].completed_count, 10);
    const totalHabits = parseInt(totalHabitsRes.rows[0].total_count, 10);
    const isStreakExtendedToday = completedToday > 0;

    // Milestones
    const milestonesRes = await db.query(`
      SELECT sm.*, 
             CASE WHEN umc.id IS NOT NULL THEN true ELSE false END as claimed
      FROM streak_milestones sm
      LEFT JOIN user_milestone_claims umc ON sm.id = umc.milestone_id AND umc.user_id = $1
      ORDER BY sm.streak_days ASC
    `, [userId]);

    // Flame Tier (Duolingo style: 1-3 ember, 4-7 flame, 8-14 blaze, 15-29 inferno, 30+ supernova)
    const currentStreak = streakData.current_streak;
    let flameTier = 'ember';
    let flameColor = '#F59E0B';
    if (currentStreak >= 30) {
      flameTier = 'supernova';
      flameColor = '#EC4899';
    } else if (currentStreak >= 14) {
      flameTier = 'inferno';
      flameColor = '#8B5CF6';
    } else if (currentStreak >= 7) {
      flameTier = 'blaze';
      flameColor = '#EF4444';
    } else if (currentStreak >= 3) {
      flameTier = 'flame';
      flameColor = '#F97316';
    }

    res.json({
      success: true,
      data: {
        user,
        streak: {
          current: currentStreak,
          longest: Math.max(streakData.longest_streak, currentStreak),
          isExtendedToday: isStreakExtendedToday,
          flameTier,
          flameColor,
          freezesAvailable: user.streak_freezes_available,
          completedTodayCount: completedToday,
          totalHabitsCount: totalHabits,
          dailyGoalMet: completedToday >= totalHabits && totalHabits > 0
        },
        milestones: milestonesRes.rows
      }
    });
  } catch (error) {
    console.error('Error fetching streak status:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Buy a Streak Freeze with earned gems
exports.buyStreakFreeze = async (req, res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const userId = req.body.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const FREEZE_COST = 50; // Gems cost

    const userRes = await client.query('SELECT gems, streak_freezes_available FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];

    if (!user || user.gems < FREEZE_COST) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: 'Not enough gems to purchase a Streak Freeze shield' });
    }

    if (user.streak_freezes_available >= 5) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: 'Max streak freeze shields already equipped (5)' });
    }

    await client.query(`
      UPDATE users 
      SET gems = gems - $1, 
          streak_freezes_available = streak_freezes_available + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [FREEZE_COST, userId]);

    await client.query('COMMIT');
    res.json({
      success: true,
      message: 'Streak Freeze Shield equipped! Your streak is protected if you miss a day.',
      data: {
        gems: user.gems - FREEZE_COST,
        freezesAvailable: user.streak_freezes_available + 1
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error buying streak freeze:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
