package com.dayekup.alarm

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject

data class StoredAlarm(
    val id: String,
    val triggerTime: Long,
    val title: String,
    val soundUri: String? = null,
    val vibrate: Boolean = true,
    val repeatDays: List<Int> = emptyList()
)

object AlarmStorage {
    private const val PREF_NAME = "DayekupAlarms"
    private const val KEY_ALARMS = "active_alarms"

    private fun getPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }

    fun saveAlarm(context: Context, alarm: StoredAlarm) {
        val alarms = getAllAlarms(context).toMutableList()
        alarms.removeAll { it.id == alarm.id }
        alarms.add(alarm)
        saveList(context, alarms)
    }

    fun removeAlarm(context: Context, alarmId: String) {
        val alarms = getAllAlarms(context).toMutableList()
        alarms.removeAll { it.id == alarmId }
        saveList(context, alarms)
    }

    fun getAlarm(context: Context, alarmId: String): StoredAlarm? =
        getAllAlarms(context).firstOrNull { it.id == alarmId }

    fun getAllAlarms(context: Context): List<StoredAlarm> {
        val jsonString = getPrefs(context).getString(KEY_ALARMS, null) ?: return emptyList()
        val result = mutableListOf<StoredAlarm>()
        try {
            val jsonArray = JSONArray(jsonString)
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                result.add(
                    StoredAlarm(
                        id = obj.getString("id"),
                        triggerTime = obj.getLong("triggerTime"),
                        title = obj.optString("title", "Dayekup Wake Up"),
                        soundUri = if (obj.has("soundUri") && !obj.isNull("soundUri")) obj.getString("soundUri") else null,
                        vibrate = obj.optBoolean("vibrate", true),
                        repeatDays = obj.optJSONArray("repeatDays")?.let { arr ->
                            (0 until arr.length()).map { arr.getInt(it) }
                        } ?: emptyList()
                    )
                )
            }
        } catch (_: Exception) {
            // Ignore parse errors
        }
        return result
    }

    private fun saveList(context: Context, list: List<StoredAlarm>) {
        val jsonArray = JSONArray()
        for (item in list) {
            val obj = JSONObject()
            obj.put("id", item.id)
            obj.put("triggerTime", item.triggerTime)
            obj.put("title", item.title)
            if (item.soundUri != null) {
                obj.put("soundUri", item.soundUri)
            }
            obj.put("vibrate", item.vibrate)
            obj.put("repeatDays", JSONArray(item.repeatDays))
            jsonArray.put(obj)
        }
        getPrefs(context).edit().putString(KEY_ALARMS, jsonArray.toString()).apply()
    }
}
