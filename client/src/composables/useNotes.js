import { useState, useEffect } from 'react';
import { INITIAL_NOTES } from '../constants/initialData';
import { sfx } from '../utils/sound';
import { saveUserData } from '../services/authStorage';

export function useNotes({ currentUser, triggerToast }) {
  const [notes, setNotes] = useState(() => {
    if (currentUser?.notes) return currentUser.notes;
    try {
      const saved = localStorage.getItem('streak_notes');
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  // When currentUser changes (login/logout/switch user), synchronize notes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.notes) setNotes(currentUser.notes);
    } else {
      try {
        const guestNotes = localStorage.getItem('streak_guest_notes');
        setNotes(guestNotes ? JSON.parse(guestNotes) : INITIAL_NOTES);
      } catch {
        setNotes(INITIAL_NOTES);
      }
    }
  }, [currentUser?.id]);

  // Persist notes whenever they change
  useEffect(() => {
    if (currentUser?.id) {
      saveUserData(currentUser.id, { notes });
    } else {
      try {
        localStorage.setItem('streak_guest_notes', JSON.stringify(notes));
      } catch (e) {}
    }
  }, [notes, currentUser?.id]);

  const addNote = (newNote) => {
    const note = {
      id: 'n_' + Date.now(),
      ...newNote,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [note, ...prev]);
    sfx.playSuccess();
    triggerToast?.(`📝 Note saved: "${note.title || 'Untitled'}"`);
  };

  const togglePinNote = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const deleteNote = (noteId) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    triggerToast?.('🗑️ Note deleted.');
  };

  return { notes, setNotes, addNote, togglePinNote, deleteNote };
}
