package com.dayekup.alarm

import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder

// Foreground service that keeps the alarm sound alive while the app is backgrounded or killed.
class AlarmRingService : Service() {

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val alarmId = intent?.getStringExtra("ALARM_ID") ?: "default_alarm"
        val alarmTitle = intent?.getStringExtra("ALARM_TITLE") ?: "Dayekup Wake Up"
        val soundUri = intent?.getStringExtra("ALARM_SOUND_URI")
        val vibrate = intent?.getBooleanExtra("ALARM_VIBRATE", true) ?: true

        val notification =
            AlarmReceiver.buildAlarmNotification(this, alarmId, alarmTitle, soundUri, vibrate)
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                startForeground(
                    AlarmReceiver.NOTIFICATION_ID,
                    notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
                )
            } else {
                startForeground(AlarmReceiver.NOTIFICATION_ID, notification)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        AlarmReceiver.ringAlarm(this, alarmId, alarmTitle, soundUri, vibrate)
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        AlarmAudioPlayer.stop()
        super.onDestroy()
    }
}
