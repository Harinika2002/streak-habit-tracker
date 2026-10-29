const db = require('../db');

// Get all tasks with duration tracking
exports.getTasks = async (req, res) => {
  try {
    const userId = req.query.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const status = req.query.status;

    let query = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.category,
        t.priority,
        t.status,
        t.estimated_duration_mins,
        t.actual_duration_seconds,
        ROUND(t.actual_duration_seconds / 60.0, 1) as actual_duration_mins,
        t.due_date,
        t.completed_at,
        t.created_at,
        COUNT(ttl.id) as sessions_count
      FROM tasks t
      LEFT JOIN task_time_logs ttl ON t.id = ttl.task_id
      WHERE t.user_id = $1
    `;
    const params = [userId];

    if (status) {
      params.push(status);
      query += ` AND t.status = $${params.length}`;
    }

    query += ` GROUP BY t.id ORDER BY t.created_at DESC`;

    const { rows } = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const userId = req.body.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const { title, description, category, priority, estimated_duration_mins, due_date } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Task title is required' });
    }

    const query = `
      INSERT INTO tasks (user_id, title, description, category, priority, estimated_duration_mins, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      userId,
      title.trim(),
      description || '',
      category || 'Work',
      priority || 'medium',
      estimated_duration_mins || 25,
      due_date || null
    ];

    const { rows } = await db.query(query, values);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Record duration for a task (from stopwatch timer or manual entry)
exports.logTaskDuration = async (req, res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const userId = req.body.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const { duration_seconds, session_type, mark_completed, notes } = req.body;

    const seconds = parseInt(duration_seconds, 10);
    if (isNaN(seconds) || seconds < 0) {
      return res.status(400).json({ success: false, error: 'Valid duration in seconds is required' });
    }

    const now = new Date();
    const startedAt = new Date(now.getTime() - seconds * 1000);

    // Insert time log
    await client.query(`
      INSERT INTO task_time_logs (task_id, user_id, duration_seconds, session_type, notes, started_at, ended_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [id, userId, seconds, session_type || 'stopwatch', notes || '', startedAt, now]);

    // Update task's total accumulated time and status
    let updateTaskQuery = `
      UPDATE tasks 
      SET actual_duration_seconds = actual_duration_seconds + $1,
          updated_at = CURRENT_TIMESTAMP
    `;
    const updateParams = [seconds, id];

    if (mark_completed) {
      updateTaskQuery += `, status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`;
    } else {
      updateTaskQuery += `, status = 'in_progress' WHERE id = $2 RETURNING *`;
    }

    const { rows } = await client.query(updateTaskQuery, updateParams);

    // Award XP based on duration: 10 XP per 10 minutes focused + 25 XP for completion
    const bonusXp = Math.floor(seconds / 600) * 10 + (mark_completed ? 25 : 5);
    await client.query(`
      UPDATE users 
      SET xp = xp + $1,
          level = FLOOR(1 + SQRT((xp + $1) / 100.0)),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [bonusXp, userId]);

    await client.query('COMMIT');
    res.json({
      success: true,
      data: {
        task: rows[0],
        duration_logged_seconds: seconds,
        xp_earned: bonusXp,
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error logging task duration:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const completedAt = status === 'completed' ? new Date() : null;
    const query = `
      UPDATE tasks 
      SET status = $1, completed_at = $2, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $3 
      RETURNING *
    `;
    const { rows } = await db.query(query, [status, completedAt, id]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
