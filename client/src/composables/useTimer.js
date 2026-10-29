import { useState, useEffect, useRef } from "react";
import { sfx } from "../utils/sound";

export function useTimer({ onPomodoroComplete }) {
  const [timerMode, setTimerMode] = useState("stopwatch"); // 'stopwatch' | 'countdown'
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [targetCountdownMins, setTargetCountdownMins] = useState(25);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (timerMode === "countdown") {
            if (prev <= 1) {
              setTimerRunning(false);
              sfx.playFanfare();
              onPomodoroComplete?.();
              return 0;
            }
            return prev - 1;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerRunning, timerMode, onPomodoroComplete]);

  const startTimer = (taskId) => {
    if (taskId) setSelectedTaskId(taskId);
    setTimerRunning(true);
    sfx.playTone(587.33, "sine", 0.1);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
    sfx.playTone(440, "sine", 0.1);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(timerMode === "countdown" ? targetCountdownMins * 60 : 0);
  };

  const switchMode = (newMode) => {
    setTimerRunning(false);
    setTimerMode(newMode);
    setTimerSeconds(newMode === "countdown" ? targetCountdownMins * 60 : 0);
  };

  return {
    timerMode,
    setTimerMode,
    timerSeconds,
    setTimerSeconds,
    timerRunning,
    selectedTaskId,
    setSelectedTaskId,
    targetCountdownMins,
    setTargetCountdownMins,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  };
}
