import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserStats } from '../../../types';
import { computeStreak } from '../../../utils';

interface GamificationState {
  userStats: UserStats;
}

// Everything starts empty; real values come from what the user actually does.
export const initialUserStats: UserStats = {
  name: '',
  level: 1,
  xp: 0,
  wakePoints: 0,
  streak: 0,
  bestStreak: 0,
  wakeHistory: {},
  wakeUpCompleted: false,
  challengeCompleted: false,
  morningGoalCompleted: false,
};

const initialState: GamificationState = {
  userStats: initialUserStats,
};

export const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    // Restores stats saved on this device.
    hydrateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      state.userStats = {
        ...initialUserStats,
        ...action.payload,
        wakeHistory: { ...(action.payload.wakeHistory ?? {}) },
      };
    },
    ensureTrackingStart: (state, action: PayloadAction<string>) => {
      if (!state.userStats.trackingSince) {
        state.userStats.trackingSince = action.payload;
      }
    },
    awardWakePoints: (state, action: PayloadAction<number>) => {
      state.userStats.wakePoints += action.payload;
      state.userStats.xp += action.payload;
      // Simple progression check
      if (state.userStats.xp >= state.userStats.level * 100) {
        state.userStats.level += 1;
      }
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userStats.name = action.payload;
    },
    // Logs a completed wake-up for the given local date (YYYY-MM-DD).
    recordWakeUp: (state, action: PayloadAction<string>) => {
      const dateKey = action.payload;
      const stats = state.userStats;
      stats.wakeHistory[dateKey] = true;
      if (!stats.trackingSince || dateKey < stats.trackingSince) {
        stats.trackingSince = dateKey;
      }
      stats.streak = computeStreak(stats.wakeHistory, dateKey);
      stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
    },
    applySnoozePenalty: (state, action: PayloadAction<number>) => {
      state.userStats.wakePoints = Math.max(0, state.userStats.wakePoints - action.payload);
      state.userStats.xp = Math.max(0, state.userStats.xp - action.payload);
    },
    completeProtocolItem: (
      state,
      action: PayloadAction<'wakeUp' | 'challenge' | 'morningGoal'>,
    ) => {
      if (action.payload === 'wakeUp') state.userStats.wakeUpCompleted = true;
      if (action.payload === 'challenge') state.userStats.challengeCompleted = true;
      if (action.payload === 'morningGoal') state.userStats.morningGoalCompleted = true;
    },
  },
});

export const {
  hydrateStats,
  ensureTrackingStart,
  awardWakePoints,
  setUserName,
  recordWakeUp,
  applySnoozePenalty,
  completeProtocolItem,
} = gamificationSlice.actions;

export default gamificationSlice.reducer;
