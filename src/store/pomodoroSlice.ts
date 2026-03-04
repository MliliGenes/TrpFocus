import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroConfig {
  focusDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export interface ThemeConfig {
  focusColor: string; // Tailwind color name e.g., 'indigo'
  breakColor: string; // Tailwind color name e.g., 'emerald'
}

interface PomodoroState {
  timeLeft: number; // in seconds
  isRunning: boolean;
  mode: PomodoroMode;
  config: PomodoroConfig;
  theme: ThemeConfig;
}

const initialState: PomodoroState = {
  timeLeft: 25 * 60,
  isRunning: false,
  mode: 'focus',
  config: {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  },
  theme: {
    focusColor: 'indigo',
    breakColor: 'emerald',
  },
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isRunning = true;
    },
    pauseTimer: (state) => {
      state.isRunning = false;
    },
    resetTimer: (state) => {
      state.isRunning = false;
      state.timeLeft = state.config[`${state.mode}Duration`] * 60;
    },
    tick: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      } else {
        state.isRunning = false;
        // Auto-switch logic could go here or in a thunk/middleware
      }
    },
    setMode: (state, action: PayloadAction<PomodoroMode>) => {
      state.mode = action.payload;
      state.timeLeft = state.config[`${action.payload}Duration`] * 60;
      state.isRunning = false;
    },
    updateConfig: (state, action: PayloadAction<Partial<PomodoroConfig>>) => {
      state.config = { ...state.config, ...action.payload };
      // If not running, update current time left to reflect new config
      if (!state.isRunning) {
         state.timeLeft = state.config[`${state.mode}Duration`] * 60;
      }
    },
    updateTheme: (state, action: PayloadAction<Partial<ThemeConfig>>) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    setTimeLeft: (state, action: PayloadAction<number>) => {
        state.timeLeft = action.payload;
    }
  },
});

export const {
  startTimer,
  pauseTimer,
  resetTimer,
  tick,
  setMode,
  updateConfig,
  updateTheme,
  setTimeLeft
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
