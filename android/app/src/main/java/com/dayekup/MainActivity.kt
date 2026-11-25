package com.dayekup

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.view.WindowManager
import com.dayekup.alarm.AlarmAudioPlayer
import com.dayekup.alarm.AlarmReceiver
import com.dayekup.alarm.NativeAlarmModule
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "Dayekup"

  override fun onCreate(savedInstanceState: Bundle?) {
    setupLockScreenFlags()
    super.onCreate(savedInstanceState)
    setupLockScreenFlags()
    handleAlarmIntent(intent)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    setupLockScreenFlags()
    handleAlarmIntent(intent)
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    setupLockScreenFlags()
  }

  override fun onResume() {
    super.onResume()
    setupLockScreenFlags()
  }

  override fun onWindowFocusChanged(hasFocus: Boolean) {
    super.onWindowFocusChanged(hasFocus)
    if (hasFocus) {
      setupLockScreenFlags()
    }
  }

  private fun setupLockScreenFlags() {
    // 1. Keep screen turned on and awake during ringing
    window.addFlags(
      WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
      WindowManager.LayoutParams.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON
    )

    // 2. Modern Android 8.0+ (API 27+) Lock Screen APIs: Show directly over the lock screen without requiring user to unlock
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      setShowWhenLocked(true)
      setTurnScreenOn(true)
    }

    // 3. Set standard window flags for all Android versions and OEM skins (Xiaomi, Samsung, Oppo, Vivo, etc.)
    // Note: Never use FLAG_DISMISS_KEYGUARD here because on secure devices (PIN/Pattern/Fingerprint)
    // FLAG_DISMISS_KEYGUARD prompts the user to unlock before showing the window, whereas
    // FLAG_SHOW_WHEN_LOCKED displays the alarm window directly ON TOP of the lock screen!
    @Suppress("DEPRECATION")
    window.addFlags(
      WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
      WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
    )
  }

  private fun handleAlarmIntent(intent: Intent?) {
    if (intent != null && intent.getBooleanExtra("ALARM_TRIGGERED", false)) {
      val alarmId = intent.getStringExtra("ALARM_ID") ?: "default_alarm"
      val alarmTitle = intent.getStringExtra("ALARM_TITLE") ?: "Dayekup Wake Up"
      val soundUri = intent.getStringExtra("ALARM_SOUND_URI")
      val vibrate = intent.getBooleanExtra("ALARM_VIBRATE", true)

      // Acquire hardware screen wake lock to ensure display turns on from sleep
      try {
        val powerManager = getSystemService(Context.POWER_SERVICE) as? PowerManager
        @Suppress("DEPRECATION")
        val screenWakeLock = powerManager?.newWakeLock(
          PowerManager.SCREEN_BRIGHT_WAKE_LOCK or
          PowerManager.ACQUIRE_CAUSES_WAKEUP or
          PowerManager.ON_AFTER_RELEASE,
          "Dayekup:MainActivityScreenWakeLock"
        )
        screenWakeLock?.acquire(60_000)
      } catch (_: Exception) {}

      // 1. Start audio and vibration immediately
      if (!AlarmAudioPlayer.isRinging()) {
        AlarmAudioPlayer.start(this, soundUri, vibrate)
      }

      // 2. Post high-priority alarm notification
      AlarmReceiver.showAlarmNotification(this, alarmId, alarmTitle, soundUri, vibrate)

      // 3. Inform React Native
      NativeAlarmModule.setPendingAlarmLaunch(alarmId)
      NativeAlarmModule.emitAlarmTrigger(alarmId, alarmTitle)
    }
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
