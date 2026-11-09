import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlarmItem } from '../../../types';

interface AlarmState {
  alarms: AlarmItem[];
  activeAlarmId: string | null;
}

const defaultAlarm: AlarmItem = {
  id: 'alarm-default-1',
  hour: '06',
  minute: '30',
  period: 'AM',
  title: 'Morning Wake Up • Tomorrow',
  enabled: true,
  repeatDays: [0, 1, 2, 3, 4], // Mon - Fri
  motivationalImage:
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  motivationalQuote: '“Remember why you started. Your future self is waiting.”',
  challengeType: 'math',
  difficulty: 'medium',
  snoozePenalty: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const initialState: AlarmState = {
  alarms: [defaultAlarm],
  activeAlarmId: null,
};

export const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
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

export const { toggleAlarm, saveAlarm, deleteAlarm, setActiveAlarm } = alarmSlice.actions;
export default alarmSlice.reducer;

