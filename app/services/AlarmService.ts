import { Linking, NativeModules, PermissionsAndroid, Platform } from 'react-native';
import { AlarmItem } from '../types';

export type AlarmPermissionKey =
  | 'notifications'
  | 'exactAlarm'
  | 'overlay'
  | 'fullScreen'
  | 'battery';

export type AlarmPermissionStatus = Record<AlarmPermissionKey, boolean>;

export interface SoundPickerResult {
  uri: string;
  title: string;
}

export interface IPlatformAlarmService {
  scheduleAlarm(alarm: AlarmItem): Promise<boolean>;
  cancelAlarm(alarmId: string): Promise<boolean>;
  triggerAlarmNow(alarmId: string, soundUri?: string, vibrate?: boolean): Promise<boolean>;
  stopAlarmSound(): Promise<boolean>;
  pauseAlarmSound(): Promise<boolean>;
  resumeAlarmSound(soundUri?: string, vibrate?: boolean): Promise<boolean>;
  pickRingtone(currentUri?: string): Promise<SoundPickerResult | null>;
  pickAudioFile(): Promise<SoundPickerResult | null>;
  playPreview(soundUri?: string): Promise<boolean>;
  stopPreview(): Promise<boolean>;
  clearInitialAlarm(): Promise<boolean>;
  canDrawOverlays(): Promise<boolean>;
  requestOverlayPermission(): Promise<boolean>;
  canUseFullScreenIntent(): Promise<boolean>;
  requestFullScreenIntentPermission(): Promise<boolean>;
  openOEMSettings(): Promise<boolean>;
  openLockScreenPermissionSettings(): Promise<boolean>;
  openAutoStartSettings(): Promise<boolean>;
  getDeviceBrand(): Promise<{ brand: string; manufacturer: string; isXiaomi: boolean }>;
  hasPromptedLockScreen(): Promise<boolean>;
  markPromptedLockScreen(): Promise<boolean>;
  hasCompletedOnboarding(): Promise<boolean>;
  markOnboardingCompleted(): Promise<boolean>;
  saveAllAlarms(alarms: AlarmItem[]): Promise<boolean>;
  getAllSavedAlarms(): Promise<AlarmItem[]>;
}

export function calculateNextTriggerTimestamp(
  alarm: AlarmItem,
  fromDate: Date = new Date(),
): number {
  let targetHour = parseInt(alarm.hour, 10);
  const targetMinute = parseInt(alarm.minute, 10);

  // Convert 12h to 24h
  if (alarm.period === 'PM' && targetHour < 12) {
    targetHour += 12;
  } else if (alarm.period === 'AM' && targetHour === 12) {
    targetHour = 0;
  }

  const targetDate = new Date(fromDate.getTime());
  targetDate.setHours(targetHour, targetMinute, 0, 0);

  // If the time already passed today, advance by at least 1 day
  if (targetDate.getTime() <= fromDate.getTime()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  // Handle repeat days: 0: Mon, 1: Tue, 2: Wed, 3: Thu, 4: Fri, 5: Sat, 6: Sun
  if (alarm.repeatDays && alarm.repeatDays.length > 0 && alarm.repeatDays.length < 7) {
    // Convert JS day (0: Sun, 1: Mon, ..., 6: Sat) to Dayekup day (0: Mon, ..., 6: Sun)
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const candidateDate = new Date(targetDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
      const jsDay = candidateDate.getDay();
      const dayekupDay = jsDay === 0 ? 6 : jsDay - 1;

      if (alarm.repeatDays.includes(dayekupDay)) {
        return candidateDate.getTime();
      }
    }
  }

  return targetDate.getTime();
}

class AndroidAlarmService implements IPlatformAlarmService {
  private get nativeModule() {
    return NativeModules.NativeAlarmModule;
  }

  async scheduleAlarm(alarm: AlarmItem): Promise<boolean> {
    const triggerTimestamp = calculateNextTriggerTimestamp(alarm);
    const title = alarm.label || alarm.title || 'Dayekup Wake Up';
    const soundUri = alarm.soundUri || null;
    const vibrate = alarm.vibrationEnabled !== false;

    try {
      if (this.nativeModule?.scheduleExactAlarm) {
        await this.nativeModule.scheduleExactAlarm(
          alarm.id,
          triggerTimestamp,
          title,
          soundUri,
          vibrate,
          alarm.repeatDays ?? [],
        );
        console.log(
          `[AndroidAlarmService] Scheduled native exact alarm ${alarm.id} at timestamp ${triggerTimestamp} (${alarm.hour}:${alarm.minute} ${alarm.period}), sound: ${alarm.soundTitle || 'default'}, vibrate: ${vibrate}`,
        );
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] Failed to schedule native alarm:', e);
    }
    return false;
  }

  async cancelAlarm(alarmId: string): Promise<boolean> {
    try {
      if (this.nativeModule?.cancelAlarm) {
        await this.nativeModule.cancelAlarm(alarmId);
        console.log(`[AndroidAlarmService] Cancelled native alarm ${alarmId}`);
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] Failed to cancel native alarm:', e);
    }
    return false;
  }

  async triggerAlarmNow(
    alarmId: string,
    soundUri?: string,
    vibrate: boolean = true,
  ): Promise<boolean> {
    try {
      if (this.nativeModule?.scheduleExactAlarm) {
        // Trigger 2 seconds from now
        const nowMs = Date.now() + 2000;
        await this.nativeModule.scheduleExactAlarm(
          alarmId,
          nowMs,
          'Dayekup Test Alarm',
          soundUri || null,
          vibrate,
          [],
        );
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] Failed to trigger immediate alarm:', e);
    }
    return false;
  }

  async stopAlarmSound(): Promise<boolean> {
    try {
      if (this.nativeModule?.stopAlarmSound) {
        await this.nativeModule.stopAlarmSound();
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] Failed to stop alarm sound:', e);
    }
    return false;
  }

  async pauseAlarmSound(): Promise<boolean> {
    try {
      if (this.nativeModule?.pauseAlarmSound) {
        await this.nativeModule.pauseAlarmSound();
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] Failed to pause alarm sound:', e);
    }
    return false;
  }

  async resumeAlarmSound(soundUri?: string, vibrate: boolean = true): Promise<boolean> {
    try {
      if (this.nativeModule?.resumeAlarmSound) {
        await this.nativeModule.resumeAlarmSound(soundUri || null, vibrate);
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] Failed to resume alarm sound:', e);
    }
    return false;
  }

  async pickRingtone(currentUri?: string): Promise<SoundPickerResult | null> {
    try {
      if (this.nativeModule?.pickRingtone) {
        const result = await this.nativeModule.pickRingtone(currentUri || null);
        if (result && result.uri) {
          return {
            uri: result.uri,
            title: result.title || 'Selected Ringtone',
          };
        }
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] Failed to pick ringtone:', e);
    }
    return null;
  }

  async pickAudioFile(): Promise<SoundPickerResult | null> {
    try {
      if (this.nativeModule?.pickAudioFile) {
        const result = await this.nativeModule.pickAudioFile();
        if (result && result.uri) {
          return {
            uri: result.uri,
            title: result.title || 'Custom Audio',
          };
        }
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] Failed to pick audio file:', e);
    }
    return null;
  }

  async playPreview(soundUri?: string): Promise<boolean> {
    try {
      if (this.nativeModule?.playPreview) {
        await this.nativeModule.playPreview(soundUri || null);
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] Failed to play preview sound:', e);
    }
    return false;
  }

  async stopPreview(): Promise<boolean> {
    try {
      if (this.nativeModule?.stopPreview) {
        await this.nativeModule.stopPreview();
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] Failed to stop preview sound:', e);
    }
    return false;
  }

  async clearInitialAlarm(): Promise<boolean> {
    try {
      if (this.nativeModule?.clearInitialAlarm) {
        await this.nativeModule.clearInitialAlarm();
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] Failed to clear initial alarm:', e);
    }
    return false;
  }

  async canDrawOverlays(): Promise<boolean> {
    try {
      if (this.nativeModule?.canDrawOverlays) {
        return await this.nativeModule.canDrawOverlays();
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] canDrawOverlays error:', e);
    }
    return true;
  }

  async requestOverlayPermission(): Promise<boolean> {
    try {
      if (this.nativeModule?.requestOverlayPermission) {
        await this.nativeModule.requestOverlayPermission();
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] requestOverlayPermission error:', e);
    }
    return false;
  }

  async canUseFullScreenIntent(): Promise<boolean> {
    try {
      if (this.nativeModule?.canUseFullScreenIntent) {
        return await this.nativeModule.canUseFullScreenIntent();
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] canUseFullScreenIntent error:', e);
    }
    return true;
  }

  async requestFullScreenIntentPermission(): Promise<boolean> {
    try {
      if (this.nativeModule?.requestFullScreenIntentPermission) {
        await this.nativeModule.requestFullScreenIntentPermission();
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] requestFullScreenIntentPermission error:', e);
    }
    return false;
  }

  async openOEMSettings(): Promise<boolean> {
    try {
      if (this.nativeModule?.openOEMSettings) {
        await this.nativeModule.openOEMSettings();
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] openOEMSettings error:', e);
    }
    return false;
  }

  async openLockScreenPermissionSettings(): Promise<boolean> {
    try {
      if (this.nativeModule?.openLockScreenPermissionSettings) {
        await this.nativeModule.openLockScreenPermissionSettings();
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] openLockScreenPermissionSettings error:', e);
    }
    return false;
  }

  async openAutoStartSettings(): Promise<boolean> {
    try {
      if (this.nativeModule?.openAutoStartSettings) {
        await this.nativeModule.openAutoStartSettings();
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] openAutoStartSettings error:', e);
    }
    return false;
  }

  async getDeviceBrand(): Promise<{ brand: string; manufacturer: string; isXiaomi: boolean }> {
    try {
      if (this.nativeModule?.getDeviceBrand) {
        const info = await this.nativeModule.getDeviceBrand();
        return {
          brand: info?.brand || 'unknown',
          manufacturer: info?.manufacturer || 'unknown',
          isXiaomi: Boolean(info?.isXiaomi),
        };
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] getDeviceBrand error:', e);
    }
    return { brand: 'unknown', manufacturer: 'unknown', isXiaomi: false };
  }

  async hasPromptedLockScreen(): Promise<boolean> {
    try {
      if (this.nativeModule?.hasPromptedLockScreen) {
        return await this.nativeModule.hasPromptedLockScreen();
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] hasPromptedLockScreen error:', e);
    }
    return false;
  }

  async markPromptedLockScreen(): Promise<boolean> {
    try {
      if (this.nativeModule?.markPromptedLockScreen) {
        await this.nativeModule.markPromptedLockScreen();
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] markPromptedLockScreen error:', e);
    }
    return false;
  }

  async hasCompletedOnboarding(): Promise<boolean> {
    try {
      if (this.nativeModule?.hasCompletedOnboarding) {
        return await this.nativeModule.hasCompletedOnboarding();
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] hasCompletedOnboarding error:', e);
    }
    return false;
  }

  async markOnboardingCompleted(): Promise<boolean> {
    try {
      if (this.nativeModule?.markOnboardingCompleted) {
        await this.nativeModule.markOnboardingCompleted();
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] markOnboardingCompleted error:', e);
    }
    return false;
  }

  async saveAllAlarms(alarms: AlarmItem[]): Promise<boolean> {
    try {
      if (this.nativeModule?.saveAlarmsJson) {
        await this.nativeModule.saveAlarmsJson(JSON.stringify(alarms));
        return true;
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] saveAllAlarms error:', e);
    }
    return false;
  }

  async getAllSavedAlarms(): Promise<AlarmItem[]> {
    try {
      if (this.nativeModule?.getAlarmsJson) {
        const json = await this.nativeModule.getAlarmsJson();
        if (json) {
          const parsed = JSON.parse(json);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('[AndroidAlarmService] getAllSavedAlarms error:', e);
    }
    return [];
  }
}

class IOSAlarmService implements IPlatformAlarmService {
  async scheduleAlarm(alarm: AlarmItem): Promise<boolean> {
    console.log(
      `[IOSAlarmService] Scheduled local notification alarm ${alarm.id} at ${alarm.hour}:${alarm.minute} ${alarm.period}`,
    );
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

  async stopAlarmSound(): Promise<boolean> {
    return true;
  }

  async pauseAlarmSound(): Promise<boolean> {
    return true;
  }

  async resumeAlarmSound(): Promise<boolean> {
    return true;
  }

  async pickRingtone(): Promise<SoundPickerResult | null> {
    return null;
  }

  async pickAudioFile(): Promise<SoundPickerResult | null> {
    return null;
  }

  async playPreview(): Promise<boolean> {
    return true;
  }

  async stopPreview(): Promise<boolean> {
    return true;
  }

  async clearInitialAlarm(): Promise<boolean> {
    return true;
  }

  async canDrawOverlays(): Promise<boolean> {
    return true;
  }

  async requestOverlayPermission(): Promise<boolean> {
    return true;
  }

  async canUseFullScreenIntent(): Promise<boolean> {
    return true;
  }

  async requestFullScreenIntentPermission(): Promise<boolean> {
    return true;
  }

  async openOEMSettings(): Promise<boolean> {
    return true;
  }

  async openLockScreenPermissionSettings(): Promise<boolean> {
    return true;
  }

  async openAutoStartSettings(): Promise<boolean> {
    return true;
  }

  async getDeviceBrand(): Promise<{ brand: string; manufacturer: string; isXiaomi: boolean }> {
    return { brand: 'apple', manufacturer: 'apple', isXiaomi: false };
  }

  async hasPromptedLockScreen(): Promise<boolean> {
    return true;
  }

  async markPromptedLockScreen(): Promise<boolean> {
    return true;
  }

  private onboardingCompleted = false;

  async hasCompletedOnboarding(): Promise<boolean> {
    return this.onboardingCompleted;
  }

  async markOnboardingCompleted(): Promise<boolean> {
    this.onboardingCompleted = true;
    return true;
  }

  private memoryAlarms: AlarmItem[] = [];

  async saveAllAlarms(alarms: AlarmItem[]): Promise<boolean> {
    this.memoryAlarms = alarms;
    return true;
  }

  async getAllSavedAlarms(): Promise<AlarmItem[]> {
    return this.memoryAlarms;
  }
}

class AlarmManagerService {
  private platformService: IPlatformAlarmService;

  constructor() {
    this.platformService =
      Platform.OS === 'android'
        ? new AndroidAlarmService()
        : new IOSAlarmService();
  }

  public async schedule(alarm: AlarmItem): Promise<boolean> {
    return this.platformService.scheduleAlarm(alarm);
  }

  public async cancel(alarmId: string): Promise<boolean> {
    return this.platformService.cancelAlarm(alarmId);
  }

  public async triggerNow(
    alarmId: string,
    soundUri?: string,
    vibrate: boolean = true,
  ): Promise<boolean> {
    return this.platformService.triggerAlarmNow(alarmId, soundUri, vibrate);
  }

  public async stopAlarmSound(): Promise<boolean> {
    return this.platformService.stopAlarmSound();
  }

  public async pauseAlarmSound(): Promise<boolean> {
    return this.platformService.pauseAlarmSound();
  }

  public async resumeAlarmSound(soundUri?: string, vibrate?: boolean): Promise<boolean> {
    return this.platformService.resumeAlarmSound(soundUri, vibrate);
  }

  public async pickRingtone(currentUri?: string): Promise<SoundPickerResult | null> {
    return this.platformService.pickRingtone(currentUri);
  }

  public async pickAudioFile(): Promise<SoundPickerResult | null> {
    return this.platformService.pickAudioFile();
  }

  public async playPreview(soundUri?: string): Promise<boolean> {
    return this.platformService.playPreview(soundUri);
  }

  public async stopPreview(): Promise<boolean> {
    return this.platformService.stopPreview();
  }

  public async clearInitialAlarm(): Promise<boolean> {
    return this.platformService.clearInitialAlarm();
  }

  public async canDrawOverlays(): Promise<boolean> {
    return this.platformService.canDrawOverlays();
  }

  public async requestOverlayPermission(): Promise<boolean> {
    return this.platformService.requestOverlayPermission();
  }

  public async canUseFullScreenIntent(): Promise<boolean> {
    return this.platformService.canUseFullScreenIntent();
  }

  public async requestFullScreenIntentPermission(): Promise<boolean> {
    return this.platformService.requestFullScreenIntentPermission();
  }

  public async openOEMSettings(): Promise<boolean> {
    return this.platformService.openOEMSettings();
  }

  public async openLockScreenPermissionSettings(): Promise<boolean> {
    return this.platformService.openLockScreenPermissionSettings();
  }

  public async openAutoStartSettings(): Promise<boolean> {
    return this.platformService.openAutoStartSettings();
  }

  public async getDeviceBrand(): Promise<{ brand: string; manufacturer: string; isXiaomi: boolean }> {
    return this.platformService.getDeviceBrand();
  }

  public async hasPromptedLockScreen(): Promise<boolean> {
    return this.platformService.hasPromptedLockScreen();
  }

  public async markPromptedLockScreen(): Promise<boolean> {
    return this.platformService.markPromptedLockScreen();
  }

  public async hasCompletedOnboarding(): Promise<boolean> {
    return this.platformService.hasCompletedOnboarding();
  }

  public async markOnboardingCompleted(): Promise<boolean> {
    return this.platformService.markOnboardingCompleted();
  }

  public async saveAllAlarms(alarms: AlarmItem[]): Promise<boolean> {
    return this.platformService.saveAllAlarms(alarms);
  }

  public async getAllSavedAlarms(): Promise<AlarmItem[]> {
    return this.platformService.getAllSavedAlarms();
  }

  /**
   * Checks and requests all required permissions for exact alarms, full-screen overlay, and background waking
   */
  public async checkAndRequestPermissions(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      // 1. Notification Permission (Android 13+ / API 33+)
      if (Platform.Version >= 33) {
        await PermissionsAndroid.request(
          'android.permission.POST_NOTIFICATIONS' as Parameters<
            typeof PermissionsAndroid.request
          >[0],
          {
            title: 'Dayekup Alarm Notifications',
            message:
              'Dayekup needs notification permission to wake you up with full-screen alarms.',
            buttonPositive: 'Allow',
          },
        );
      }

      // 2. Exact Alarm Permission (Android 12+ / API 31+)
      const nativeModule = NativeModules.NativeAlarmModule;
      if (nativeModule?.canScheduleExactAlarms) {
        const canExact = await nativeModule.canScheduleExactAlarms();
        if (!canExact && nativeModule.requestExactAlarmPermission) {
          await nativeModule.requestExactAlarmPermission();
        }
      }

      // 3. Battery Optimization Exemption (To guarantee firing even in deep Doze mode)
      if (nativeModule?.checkBatteryOptimization) {
        const isIgnoringBattery = await nativeModule.checkBatteryOptimization();
        if (!isIgnoringBattery && nativeModule.requestIgnoreBatteryOptimization) {
          await nativeModule.requestIgnoreBatteryOptimization();
        }
      }

      // 4. Full-Screen Intent Permission (Android 14+ / API 34+)
      if (nativeModule?.canUseFullScreenIntent) {
        const canFullScreen = await nativeModule.canUseFullScreenIntent();
        if (!canFullScreen && nativeModule.requestFullScreenIntentPermission) {
          await nativeModule.requestFullScreenIntentPermission();
        }
      }

      // 5. Display Over Other Apps (Overlay) Permission (Android 10+ / API 29+)
      // Essential for showing the full-screen alarm overlay instead of a heads-up notification!
      if (nativeModule?.canDrawOverlays) {
        const canOverlay = await nativeModule.canDrawOverlays();
        if (!canOverlay && nativeModule.requestOverlayPermission) {
          await nativeModule.requestOverlayPermission();
        }
      }
    } catch (e) {
      console.warn('[AlarmService] Permission request exception:', e);
    }
  }

  /**
   * Reports which of the permissions the alarm needs in order to ring reliably are granted.
   */
  public async getPermissionStatus(): Promise<AlarmPermissionStatus> {
    const granted: AlarmPermissionStatus = {
      notifications: true,
      exactAlarm: true,
      overlay: true,
      fullScreen: true,
      battery: true,
    };
    if (Platform.OS !== 'android') return granted;

    try {
      const nativeModule = NativeModules.NativeAlarmModule;
      if (Platform.Version >= 33) {
        granted.notifications = await PermissionsAndroid.check(
          'android.permission.POST_NOTIFICATIONS' as Parameters<
            typeof PermissionsAndroid.check
          >[0],
        );
      }
      if (nativeModule?.canScheduleExactAlarms) {
        granted.exactAlarm = await nativeModule.canScheduleExactAlarms();
      }
      if (nativeModule?.canDrawOverlays) {
        granted.overlay = await nativeModule.canDrawOverlays();
      }
      if (nativeModule?.canUseFullScreenIntent) {
        granted.fullScreen = await nativeModule.canUseFullScreenIntent();
      }
      if (nativeModule?.checkBatteryOptimization) {
        granted.battery = await nativeModule.checkBatteryOptimization();
      }
    } catch (e) {
      console.warn('[AlarmService] getPermissionStatus error:', e);
    }
    return granted;
  }

  /**
   * Asks for a single permission, opening the matching system screen when a dialog is not possible.
   */
  public async requestPermission(key: AlarmPermissionKey): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      const nativeModule = NativeModules.NativeAlarmModule;
      switch (key) {
        case 'notifications': {
          const result = await PermissionsAndroid.request(
            'android.permission.POST_NOTIFICATIONS' as Parameters<
              typeof PermissionsAndroid.request
            >[0],
          );
          if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            await Linking.openSettings();
          }
          break;
        }
        case 'exactAlarm':
          await nativeModule?.requestExactAlarmPermission?.();
          break;
        case 'overlay':
          await nativeModule?.requestOverlayPermission?.();
          break;
        case 'fullScreen':
          await nativeModule?.requestFullScreenIntentPermission?.();
          break;
        case 'battery':
          await nativeModule?.requestIgnoreBatteryOptimization?.();
          break;
      }
    } catch (e) {
      console.warn('[AlarmService] requestPermission error:', e);
    }
  }

  /**
   * True when the permission setup screen has to be shown: something required is missing, or
   * this is a Xiaomi device where the manual lock-screen steps were never walked through.
   */
  public async needsPermissionSetup(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;

    const [status, brandInfo, prompted] = await Promise.all([
      this.getPermissionStatus(),
      this.getDeviceBrand(),
      this.hasPromptedLockScreen(),
    ]);
    const allGranted = Object.values(status).every(Boolean);
    return !allGranted || (Boolean(brandInfo?.isXiaomi) && !prompted);
  }

  /**
   * Checks if the app was launched by a background alarm firing
   */
  public async getInitialAlarm(): Promise<string | null> {
    if (Platform.OS !== 'android') return null;
    try {
      const nativeModule = NativeModules.NativeAlarmModule;
      if (nativeModule?.getInitialAlarm) {
        const data = await nativeModule.getInitialAlarm();
        return data?.alarmId || null;
      }
    } catch (e) {
      console.warn('[AlarmService] getInitialAlarm error:', e);
    }
    return null;
  }
}

export const AlarmService = new AlarmManagerService();
