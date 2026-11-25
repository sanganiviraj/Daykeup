package com.dayekup.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import java.util.Calendar

// Arms alarms with AlarmManager and works out the next day of a repeating alarm, so the
// following alarm is already registered by the time one fires, with or without the app running.
object AlarmScheduler {

    fun schedule(context: Context, alarm: StoredAlarm): Boolean {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return false

        val alarmIntent = Intent(context, AlarmReceiver::class.java).apply {
            action = "com.dayekup.ACTION_ALARM_TRIGGER"
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

        // The alarm fires a broadcast to AlarmReceiver, which starts a foreground service for the
        // sound. Launching an Activity directly is blocked by OEMs when the app is in the
        // background or killed.
        val triggerIntent = PendingIntent.getBroadcast(
            context, alarm.id.hashCode(), alarmIntent, pendingFlags
        )
        val showIntent = PendingIntent.getActivity(
            context,
            alarm.id.hashCode() + 1,
            Intent(context, com.dayekup.MainActivity::class.java),
            pendingFlags
        )

        return try {
            alarmManager.setAlarmClock(
                AlarmManager.AlarmClockInfo(alarm.triggerTime, showIntent),
                triggerIntent
            )
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    // Next trigger strictly after [now] on one of [repeatDays] (0 = Mon ... 6 = Sun),
    // keeping the same wall-clock time. Null for one-time alarms.
    fun nextRepeatTrigger(previousTrigger: Long, repeatDays: List<Int>, now: Long): Long? {
        if (repeatDays.isEmpty()) return null
        val cal = Calendar.getInstance().apply { timeInMillis = previousTrigger }
        for (i in 0 until 370) {
            cal.add(Calendar.DAY_OF_YEAR, 1)
            val dayekupDay = (cal.get(Calendar.DAY_OF_WEEK) + 5) % 7
            if (cal.timeInMillis > now && repeatDays.contains(dayekupDay)) {
                return cal.timeInMillis
            }
        }
        return null
    }

    // Re-arms the following occurrence of a repeating alarm and stores it.
    fun rearmRepeating(context: Context, alarm: StoredAlarm, now: Long = System.currentTimeMillis()): Boolean {
        val next = nextRepeatTrigger(alarm.triggerTime, alarm.repeatDays, now) ?: return false
        val updated = alarm.copy(triggerTime = next)
        AlarmStorage.saveAlarm(context, updated)
        return schedule(context, updated)
    }
}
