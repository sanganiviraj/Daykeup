package com.dayekup.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        if (action == Intent.ACTION_BOOT_COMPLETED ||
            action == "android.intent.action.QUICKBOOT_POWERON" ||
            action == Intent.ACTION_MY_PACKAGE_REPLACED
        ) {
            val alarms = AlarmStorage.getAllAlarms(context)
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return

            val now = System.currentTimeMillis()
            for (alarm in alarms) {
                // If alarm time is in future, re-schedule it
                if (alarm.triggerTime > now) {
                    val fullScreenIntent = Intent(context, com.dayekup.MainActivity::class.java).apply {
                        this.action = "com.dayekup.ACTION_ALARM_FULLSCREEN"
                        addFlags(
                            Intent.FLAG_ACTIVITY_NEW_TASK or
                            Intent.FLAG_ACTIVITY_CLEAR_TOP or
                            Intent.FLAG_ACTIVITY_SINGLE_TOP or
                            Intent.FLAG_INCLUDE_STOPPED_PACKAGES
                        )
                        putExtra("ALARM_TRIGGERED", true)
                        putExtra("ALARM_ID", alarm.id)
                        putExtra("ALARM_TITLE", alarm.title)
                        putExtra("ALARM_SOUND_URI", alarm.soundUri)
                        putExtra("ALARM_VIBRATE", alarm.vibrate)
                    }

                    val pendingFlags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    } else {
                        PendingIntent.FLAG_UPDATE_CURRENT
                    }

                    val activityPendingIntent = PendingIntent.getActivity(
                        context,
                        alarm.id.hashCode(),
                        fullScreenIntent,
                        pendingFlags
                    )

                    val showIntent = Intent(context, com.dayekup.MainActivity::class.java)
                    val showPendingIntent = PendingIntent.getActivity(
                        context,
                        alarm.id.hashCode() + 1,
                        showIntent,
                        pendingFlags
                    )

                    try {
                        val alarmClockInfo = AlarmManager.AlarmClockInfo(alarm.triggerTime, showPendingIntent)
                        alarmManager.setAlarmClock(alarmClockInfo, activityPendingIntent)
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
        }
    }
}
