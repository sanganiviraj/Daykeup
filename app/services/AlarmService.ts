import { Platform } from 'react-native';
import { AlarmItem } from '../types';

export interface IPlatformAlarmService {
  scheduleAlarm(alarm: AlarmItem): Promise<boolean>;
  cancelAlarm(alarmId: string): Promise<boolean>;
  triggerAlarmNow(alarmId: string): Promise<boolean>;
}

class AndroidAlarmService implements IPlatformAlarmService {
  async scheduleAlarm(alarm: AlarmItem): Promise<boolean> {
    // Android AlarmManager exact alarm integration point
    console.log(`[AndroidAlarmService] Scheduled exact alarm ${alarm.id} at ${alarm.hour}:${alarm.minute} ${alarm.period}`);
    return true;
  }

  async cancelAlarm(alarmId: string): Promise<boolean> {
    console.log(`[AndroidAlarmService] Cancelled alarm ${alarmId}`);
    return true;
  }

  async triggerAlarmNow(alarmId: string): Promise<boolean> {
    console.log(`[AndroidAlarmService] Triggered alarm ${alarmId}`);
    return true;
  }
}

class IOSAlarmService implements IPlatformAlarmService {
  async scheduleAlarm(alarm: AlarmItem): Promise<boolean> {
    // iOS UNUserNotificationCenter scheduling point
    console.log(`[IOSAlarmService] Scheduled local notification alarm ${alarm.id} at ${alarm.hour}:${alarm.minute} ${alarm.period}`);
    return true;
  }

  async cancelAlarm(alarmId: string): Promise<boolean> {
    console.log(`[IOSAlarmService] Cancelled alarm ${alarmId}`);
    return true;
  }

  async triggerAlarmNow(alarmId: string): Promise<boolean> {
    console.log(`[IOSAlarmService] Triggered alarm ${alarmId}`);
    return true;
  }
}

class AlarmManagerService {
  private platformService: IPlatformAlarmService;

  constructor() {
    this.platformService = Platform.OS === 'android' ? new AndroidAlarmService() : new IOSAlarmService();
  }

  public async schedule(alarm: AlarmItem): Promise<boolean> {
    return this.platformService.scheduleAlarm(alarm);
  }

  public async cancel(alarmId: string): Promise<boolean> {
    return this.platformService.cancelAlarm(alarmId);
  }

  public async triggerNow(alarmId: string): Promise<boolean> {
    return this.platformService.triggerAlarmNow(alarmId);
  }
}

export const AlarmService = new AlarmManagerService();

