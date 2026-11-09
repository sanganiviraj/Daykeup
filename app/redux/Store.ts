import { configureStore } from '@reduxjs/toolkit';
import alarmReducer from './slices/alarm-slice/AlarmSlice';
import gamificationReducer from './slices/gamification-slice/GamificationSlice';

export const store = configureStore({
  reducer: {
    alarm: alarmReducer,
    gamification: gamificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

