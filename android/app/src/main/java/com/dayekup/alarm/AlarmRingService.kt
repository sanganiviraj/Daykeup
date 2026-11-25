package com.dayekup.alarm

import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder

// Foreground service that keeps the alarm sound alive while the app is backgrounded or killed.
class AlarmRingService : Service() {

    private var unlockReceiver: BroadcastReceiver? = null

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
        registerUnlockReceiver(alarmId, alarmTitle, soundUri, vibrate)
        return START_NOT_STICKY
    }

    // The full-screen intent only shows over the lock screen. Once the user unlocks, Android
    // downgrades it to a heads-up, so bring the alarm screen up as soon as the device unlocks.
    private fun registerUnlockReceiver(
        alarmId: String,
        alarmTitle: String,
        soundUri: String?,
        vibrate: Boolean
    ) {
        unregisterUnlockReceiver()
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                if (!AlarmAudioPlayer.isRinging()) return
                val launch = Intent(context, com.dayekup.MainActivity::class.java).apply {
                    action = "com.dayekup.ACTION_ALARM_FULLSCREEN"
                    addFlags(
                        Intent.FLAG_ACTIVITY_NEW_TASK or
                        Intent.FLAG_ACTIVITY_CLEAR_TOP or
                        Intent.FLAG_ACTIVITY_SINGLE_TOP
                    )
                    putExtra("ALARM_TRIGGERED", true)
                    putExtra("ALARM_ID", alarmId)
                    putExtra("ALARM_TITLE", alarmTitle)
                    putExtra("ALARM_SOUND_URI", soundUri)
                    putExtra("ALARM_VIBRATE", vibrate)
                }
                try {
                    context.startActivity(launch)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
        unlockReceiver = receiver
        registerReceiver(receiver, IntentFilter(Intent.ACTION_USER_PRESENT))
    }

    private fun unregisterUnlockReceiver() {
        unlockReceiver?.let {
            try {
                unregisterReceiver(it)
            } catch (_: Exception) {}
        }
        unlockReceiver = null
    }

    override fun onDestroy() {
        unregisterUnlockReceiver()
        AlarmAudioPlayer.stop()
        super.onDestroy()
    }
}
