import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnboardingState, WakeStyle } from '../../../types';
import {
  defaultOnboardingState,
  onboardingWakeStyleOptions,
  WAKE_STEP_MINUTES,
} from '../../../constants';

const MINUTES_PER_DAY = 24 * 60;

const initialState: OnboardingState = {
  ...defaultOnboardingState,
  repeatDays: [...defaultOnboardingState.repeatDays],
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    updateOnboarding: (state, action: PayloadAction<Partial<OnboardingState>>) => {
      Object.assign(state, action.payload);
    },
    // Picking a wake style also suggests a matching challenge intensity.
    selectWakeStyle: (state, action: PayloadAction<WakeStyle>) => {
      state.wakeStyle = action.payload;
      const option = onboardingWakeStyleOptions.find(o => o.key === action.payload);
      if (option) {
        state.difficulty = option.difficulty;
      }
    },
    // direction: -1 moves the wake time earlier, 1 moves it later
    shiftWakeTime: (state, action: PayloadAction<1 | -1>) => {
      const next = state.wakeMinutes + action.payload * WAKE_STEP_MINUTES;
      state.wakeMinutes = ((next % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
    },
    toggleOnboardingDay: (state, action: PayloadAction<number>) => {
      state.repeatDays = state.repeatDays.includes(action.payload)
        ? state.repeatDays.filter(d => d !== action.payload)
        : [...state.repeatDays, action.payload].sort((a, b) => a - b);
    },
  },
});

export const {
  updateOnboarding,
  selectWakeStyle,
  shiftWakeTime,
  toggleOnboardingDay,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
