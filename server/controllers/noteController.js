const db = require('../db');

// Get notes
exports.getNotes = async (req, res) => {
  try {
    const userId = req.query.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const tag = req.query.tag;

    let query = `
      SELECT * FROM notes 
      WHERE user_id = $1
    `;
    const params = [userId];

    if (tag && tag !== 'All') {
      params.push(tag);
      query += ` AND tag = $${params.length}`;
    }

    query += ` ORDER BY is_pinned DESC, created_at DESC`;

    const { rows } = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const userId = req.body.userId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const { title, content, tag, is_pinned, linked_habit_id, linked_task_id } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ success: false, error: 'Note content is required' });
    }

    const query = `
      INSERT INTO notes (user_id, title, content, tag, is_pinned, linked_habit_id, linked_task_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      userId,
      title ? title.trim() : 'Quick Note',
      content.trim(),
      tag || 'Reflection',
      is_pinned || false,
      linked_habit_id || null,
      linked_task_id || null
    ];

    const { rows } = await db.query(query, values);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Toggle pin status
exports.togglePin = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      UPDATE notes 
      SET is_pinned = NOT is_pinned, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const { rows } = await db.query(query, [id]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error toggling pin:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM notes WHERE id = $1`, [id]);
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
