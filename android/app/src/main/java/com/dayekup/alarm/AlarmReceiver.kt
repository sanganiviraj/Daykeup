package com.dayekup.alarm

import android.app.ActivityOptions
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import com.dayekup.MainActivity
import com.dayekup.R

class AlarmReceiver : BroadcastReceiver() {
    companion object {
        const val CHANNEL_ID = "dayekup_alarm_v5"
        const val CHANNEL_NAME = "Dayekup Wake Up Alarms"
        const val NOTIFICATION_ID = 10001

        fun cancelNotification(context: Context) {
            try {
                val notificationManager =
                    context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
                notificationManager?.cancel(NOTIFICATION_ID)
                context.stopService(Intent(context, AlarmRingService::class.java))
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        fun createNotificationChannel(context: Context) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val notificationManager =
                    context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager ?: return

                try {
                    notificationManager.deleteNotificationChannel("dayekup_alarm_v4")
                    notificationManager.deleteNotificationChannel("dayekup_alarm_v3")
                } catch (_: Exception) {}

                val channel = NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "High-priority full-screen wake-up alarms for Dayekup"
                    enableVibration(true)
                    vibrationPattern = longArrayOf(0, 1000, 500, 1000)
                    setBypassDnd(true)
                    lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                    val audioAttributes = AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .build()
                    val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                        ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
                    setSound(soundUri, audioAttributes)
                }
                notificationManager.createNotificationChannel(channel)
            }
        }

        fun showAlarmNotification(
            context: Context,
            alarmId: String,
            alarmTitle: String,
            soundUri: String?,
            vibrate: Boolean
        ) {
            val notification = buildAlarmNotification(context, alarmId, alarmTitle, soundUri, vibrate)
            val notificationManager =
                context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
            notificationManager?.notify(NOTIFICATION_ID, notification)
        }

        fun buildAlarmNotification(
            context: Context,
            alarmId: String,
            alarmTitle: String,
            soundUri: String?,
            vibrate: Boolean
        ): Notification {
            createNotificationChannel(context)

            val fullScreenIntent = Intent(context, MainActivity::class.java).apply {
                action = "com.dayekup.ACTION_ALARM_FULLSCREEN"
                addFlags(
                    Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TOP or
                    Intent.FLAG_ACTIVITY_SINGLE_TOP or
                    Intent.FLAG_INCLUDE_STOPPED_PACKAGES
                )
                putExtra("ALARM_TRIGGERED", true)
                putExtra("ALARM_ID", alarmId)
                putExtra("ALARM_TITLE", alarmTitle)
                putExtra("ALARM_SOUND_URI", soundUri)
                putExtra("ALARM_VIBRATE", vibrate)
            }

            val pendingFlags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }

            val fullScreenPendingIntent = PendingIntent.getActivity(
                context,
                alarmId.hashCode(),
                fullScreenIntent,
                pendingFlags
            )

            val notification = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("⏰ $alarmTitle")
                .setContentText("Rise & Conquer! Tap to dismiss.")
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setContentIntent(fullScreenPendingIntent)
                .setFullScreenIntent(fullScreenPendingIntent, true)
                .setAutoCancel(false)
                .setOngoing(true)
                .build()

            notification.flags = notification.flags or
                Notification.FLAG_INSISTENT or
                Notification.FLAG_ONGOING_EVENT

            return notification
        }

        // Wakes the screen, starts sound + vibration, tells React Native and tries to open the app.
        fun ringAlarm(
            context: Context,
            alarmId: String,
            alarmTitle: String,
            soundUri: String?,
            vibrate: Boolean
        ) {
            val powerManager = context.getSystemService(Context.POWER_SERVICE) as? PowerManager

            @Suppress("DEPRECATION")
            val screenWakeLock = powerManager?.newWakeLock(
                PowerManager.SCREEN_BRIGHT_WAKE_LOCK or
                PowerManager.ACQUIRE_CAUSES_WAKEUP or
                PowerManager.ON_AFTER_RELEASE,
                "Dayekup:ScreenTurnOnWakeLock"
            )
            screenWakeLock?.acquire(60_000)

            val cpuWakeLock = powerManager?.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP,
                "Dayekup:AlarmCpuWakeLock"
            )
            cpuWakeLock?.acquire(3 * 60 * 1000L)

            AlarmAudioPlayer.start(context, soundUri, vibrate)

            NativeAlarmModule.setPendingAlarmLaunch(alarmId)
            NativeAlarmModule.emitAlarmTrigger(alarmId, alarmTitle)

            showAlarmNotification(context, alarmId, alarmTitle, soundUri, vibrate)

            val fullScreenIntent = Intent(context, MainActivity::class.java).apply {
                action = "com.dayekup.ACTION_ALARM_FULLSCREEN"
                addFlags(
                    Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TOP or
                    Intent.FLAG_ACTIVITY_SINGLE_TOP or
                    Intent.FLAG_INCLUDE_STOPPED_PACKAGES
                )
                putExtra("ALARM_TRIGGERED", true)
                putExtra("ALARM_ID", alarmId)
                putExtra("ALARM_TITLE", alarmTitle)
                putExtra("ALARM_SOUND_URI", soundUri)
                putExtra("ALARM_VIBRATE", vibrate)
            }

            try {
                context.startActivity(fullScreenIntent)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        val alarmId = intent.getStringExtra("ALARM_ID") ?: "default_alarm"
        val alarmTitle = intent.getStringExtra("ALARM_TITLE") ?: "Dayekup Wake Up"
        val soundUri = intent.getStringExtra("ALARM_SOUND_URI")
        val vibrate = intent.getBooleanExtra("ALARM_VIBRATE", true)

        // Arm tomorrow's (or the next selected day's) alarm first, so a repeating alarm keeps
        // working even if the app is never opened after this one rings.
        try {
            AlarmStorage.getAlarm(context, alarmId)?.let { stored ->
                if (stored.repeatDays.isNotEmpty()) AlarmScheduler.rearmRepeating(context, stored)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // The alarm broadcast runs even when the app is backgrounded or killed. A foreground
        // service keeps the sound playing; if it cannot start, ring directly from the receiver.
        try {
            val serviceIntent = Intent(context, AlarmRingService::class.java).apply {
                putExtra("ALARM_ID", alarmId)
                putExtra("ALARM_TITLE", alarmTitle)
                putExtra("ALARM_SOUND_URI", soundUri)
                putExtra("ALARM_VIBRATE", vibrate)
            }
            context.startForegroundService(serviceIntent)
        } catch (e: Exception) {
            e.printStackTrace()
            ringAlarm(context, alarmId, alarmTitle, soundUri, vibrate)
        }
    }
}
