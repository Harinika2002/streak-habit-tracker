import { useState, useEffect } from 'react';
import { INITIAL_TASKS } from '../constants/initialData';
import { sfx } from '../utils/sound';
import { saveUserData } from '../services/authStorage';
import { notificationService } from '../utils/notifications';

export function useTasks({ currentUser, triggerToast }) {
  const [tasks, setTasks] = useState(() => {
    if (currentUser?.tasks) return currentUser.tasks;
    try {
      const saved = localStorage.getItem('streak_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // When currentUser changes (login/logout/switch user), synchronize tasks
  useEffect(() => {
    if (currentUser) {
      if (currentUser.tasks) setTasks(currentUser.tasks);
    } else {
      try {
        const guestTasks = localStorage.getItem('streak_guest_tasks');
        setTasks(guestTasks ? JSON.parse(guestTasks) : INITIAL_TASKS);
      } catch {
        setTasks(INITIAL_TASKS);
      }
    }
  }, [currentUser?.id]);

  // Persist tasks whenever they change
  useEffect(() => {
    if (currentUser?.id) {
      saveUserData(currentUser.id, { tasks });
    } else {
      try {
        localStorage.setItem('streak_guest_tasks', JSON.stringify(tasks));
      } catch (e) {}
    }
  }, [tasks, currentUser?.id]);

  const addTask = (newTask) => {
    const task = {
      id: 't_' + Date.now(),
      ...newTask,
      status: 'pending',
      durationSeconds: 0,
      completedAt: null,
    };
    setTasks((prev) => [task, ...prev]);
    sfx.playSuccess();
    triggerToast?.(`⚡ Task "${task.title}" created with target timer!`);
  };

  const logTaskDuration = (taskId, additionalSeconds) => {
    let taskTitle = 'Focus Session';
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          taskTitle = t.title;
          return {
            ...t,
            durationSeconds: (t.durationSeconds || 0) + additionalSeconds,
            status: 'completed',
            completedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
    sfx.playSuccess();
    triggerToast?.(`⏱️ Logged ${Math.round(additionalSeconds / 60)}m focus time on task!`);

    // Browser notification
    notificationService.sendTimerCompletedNotification(taskTitle);
  };

  const completeTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: t.status === 'completed' ? 'pending' : 'completed',
            completedAt: t.status === 'completed' ? null : new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  return { tasks, setTasks, addTask, logTaskDuration, completeTask };
}
