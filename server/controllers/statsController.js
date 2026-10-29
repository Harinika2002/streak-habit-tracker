const db = require('../db');

// Get 30-day consistency heatmap and focus duration summary
exports.getStatsSummary = async (req, res) => {
  try {
    const userId = req.query.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    // 1. Habit completion heatmap for past 30 days
    const heatmapQuery = `
      SELECT 
        d.date::DATE as log_date,
        COUNT(hl.id) FILTER (WHERE hl.completed = TRUE) as completions,
        COALESCE(SUM(hl.duration_minutes), 0) as habit_minutes
      FROM generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, '1 day'::interval) d(date)
      LEFT JOIN habit_logs hl ON hl.log_date = d.date::DATE AND hl.user_id = $1
      GROUP BY d.date
      ORDER BY d.date ASC
    `;
    const heatmapRes = await db.query(heatmapQuery, [userId]);

    // 2. Task focus duration today, this week, and all-time
    const taskStatsQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN ttl.started_at >= CURRENT_DATE THEN ttl.duration_seconds ELSE 0 END), 0) as today_focus_seconds,
        COALESCE(SUM(CASE WHEN ttl.started_at >= DATE_TRUNC('week', CURRENT_DATE) THEN ttl.duration_seconds ELSE 0 END), 0) as week_focus_seconds,
        COALESCE(SUM(ttl.duration_seconds), 0) as total_focus_seconds,
        COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'completed') as total_tasks_completed
      FROM tasks t
      LEFT JOIN task_time_logs ttl ON t.id = ttl.task_id AND ttl.user_id = $1
      WHERE t.user_id = $1
    `;
    const taskStatsRes = await db.query(taskStatsQuery, [userId]);
    const taskStats = taskStatsRes.rows[0];

    // 3. Category breakdown of time
    const categoryQuery = `
      SELECT 
        COALESCE(t.category, 'Uncategorized') as category,
        ROUND(SUM(ttl.duration_seconds) / 60.0, 1) as total_minutes
      FROM tasks t
      JOIN task_time_logs ttl ON t.id = ttl.task_id
      WHERE t.user_id = $1
      GROUP BY t.category
      ORDER BY total_minutes DESC
    `;
    const categoryRes = await db.query(categoryQuery, [userId]);

    res.json({
      success: true,
      data: {
        heatmap: heatmapRes.rows,
        focusDuration: {
          todayMinutes: Math.round(taskStats.today_focus_seconds / 60),
          weekMinutes: Math.round(taskStats.week_focus_seconds / 60),
          totalHours: (taskStats.total_focus_seconds / 3600).toFixed(1),
          tasksCompleted: parseInt(taskStats.total_tasks_completed, 10)
        },
        categoryBreakdown: categoryRes.rows
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
