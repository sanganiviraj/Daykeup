import { configureStore } from '@reduxjs/toolkit';
import alarmReducer from './slices/alarm-slice/AlarmSlice';
import gamificationReducer from './slices/gamification-slice/GamificationSlice';
import onboardingReducer from './slices/onboarding-slice/OnboardingSlice';

export const store = configureStore({
  reducer: {
    alarm: alarmReducer,
    gamification: gamificationReducer,
    onboarding: onboardingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

