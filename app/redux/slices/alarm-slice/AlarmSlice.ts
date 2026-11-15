import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlarmItem } from '../../../types';

interface AlarmState {
  alarms: AlarmItem[];
  activeAlarmId: string | null;
}

const initialState: AlarmState = {
  alarms: [],
  activeAlarmId: null,
};

export const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
    setAlarms: (state, action: PayloadAction<AlarmItem[]>) => {
      state.alarms = action.payload;
    },
    toggleAlarm: (state, action: PayloadAction<string>) => {
      const alarm = state.alarms.find(a => a.id === action.payload);
      if (alarm) {
        alarm.enabled = !alarm.enabled;
        alarm.updatedAt = new Date().toISOString();
      }
    },
    saveAlarm: (state, action: PayloadAction<AlarmItem>) => {
      const idx = state.alarms.findIndex(a => a.id === action.payload.id);
      if (idx >= 0) {
        state.alarms[idx] = action.payload;
      } else {
        state.alarms.unshift(action.payload);
      }
    },
    deleteAlarm: (state, action: PayloadAction<string>) => {
      state.alarms = state.alarms.filter(a => a.id !== action.payload);
    },
    setActiveAlarm: (state, action: PayloadAction<string | null>) => {
      state.activeAlarmId = action.payload;
    },
  },
});

export const { setAlarms, toggleAlarm, saveAlarm, deleteAlarm, setActiveAlarm } = alarmSlice.actions;
export default alarmSlice.reducer;
