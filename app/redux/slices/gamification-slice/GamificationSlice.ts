import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserStats } from '../../../types';

interface GamificationState {
  userStats: UserStats;
}

const initialState: GamificationState = {
  userStats: {
    name: 'Viraj',
    level: 14,
    xp: 1240,
    wakePoints: 1240,
    streak: 7,
    wakeUpCompleted: true,
    challengeCompleted: true,
    morningGoalCompleted: false,
  },
};

export const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    awardWakePoints: (state, action: PayloadAction<number>) => {
      state.userStats.wakePoints += action.payload;
      state.userStats.xp += action.payload;
      // Simple progression check
      if (state.userStats.xp >= state.userStats.level * 100) {
        state.userStats.level += 1;
      }
    },
    incrementStreak: state => {
      state.userStats.streak += 1;
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
  awardWakePoints,
  incrementStreak,
  applySnoozePenalty,
  completeProtocolItem,
} = gamificationSlice.actions;

export default gamificationSlice.reducer;

