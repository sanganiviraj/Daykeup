package com.dayekup.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        if (action == Intent.ACTION_BOOT_COMPLETED ||
            action == "android.intent.action.QUICKBOOT_POWERON" ||
            action == Intent.ACTION_MY_PACKAGE_REPLACED
        ) {
            val now = System.currentTimeMillis()
            for (alarm in AlarmStorage.getAllAlarms(context)) {
                if (alarm.triggerTime > now) {
                    AlarmScheduler.schedule(context, alarm)
                } else if (alarm.repeatDays.isNotEmpty()) {
                    // Missed while the phone was off: a repeating alarm is armed for its next day.
                    AlarmScheduler.rearmRepeating(context, alarm, now)
                }
            }
        }
    }
}
