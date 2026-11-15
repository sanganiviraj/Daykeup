package com.dayekup.alarm

import android.app.Activity
import android.app.AlarmManager
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.OpenableColumns
import android.provider.Settings
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class NativeAlarmModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    companion object {
        const val NAME = "NativeAlarmModule"
        private const val REQUEST_CODE_RINGTONE_PICKER = 9901
        private const val REQUEST_CODE_AUDIO_FILE_PICKER = 9902
        private var pendingAlarmId: String? = null
        private var instance: NativeAlarmModule? = null

        fun setPendingAlarmLaunch(alarmId: String?) {
            pendingAlarmId = alarmId
        }

        fun emitAlarmTrigger(alarmId: String, title: String) {
            instance?.sendAlarmTriggerEvent(alarmId, title)
        }
    }

    private var ringtonePickerPromise: Promise? = null
    private var audioFilePickerPromise: Promise? = null

    init {
        instance = this
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String = NAME

    fun sendAlarmTriggerEvent(alarmId: String, title: String) {
        try {
            if (reactContext.hasActiveReactInstance()) {
                val params = Arguments.createMap().apply {
                    putString("alarmId", alarmId)
                    putString("title", title)
                }
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("ON_ALARM_TRIGGERED", params)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for React Native built-in EventEmitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for React Native built-in EventEmitter
    }

    @ReactMethod
    fun scheduleExactAlarm(
        alarmId: String,
        triggerTimestamp: Double,
        title: String,
        soundUri: String?,
        vibrate: Boolean,
        promise: Promise
    ) {
        try {
            val alarmManager = reactContext.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
            if (alarmManager == null) {
                promise.reject("ERR_NO_ALARM_MGR", "AlarmManager not available")
                return
            }

            val triggerTimeMs = triggerTimestamp.toLong()

            // Save alarm in persistent storage so it survives reboots and app kills
            AlarmStorage.saveAlarm(
                reactContext,
                StoredAlarm(alarmId, triggerTimeMs, title, soundUri, vibrate)
            )

            // 1. Direct Activity Intent:
            // Using PendingIntent.getActivity directly starts MainActivity over the lockscreen
            // even if the app was killed/swiped away, completely bypassing BroadcastQueue restrictions!
            val fullScreenIntent = Intent(reactContext, com.dayekup.MainActivity::class.java).apply {
                action = "com.dayekup.ACTION_ALARM_FULLSCREEN"
                addFlags(
                    Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TOP or
                    Intent.FLAG_ACTIVITY_SINGLE_TOP or
                    Intent.FLAG_INCLUDE_STOPPED_PACKAGES
                )
                putExtra("ALARM_TRIGGERED", true)
                putExtra("ALARM_ID", alarmId)
                putExtra("ALARM_TITLE", title)
                putExtra("ALARM_SOUND_URI", soundUri)
                putExtra("ALARM_VIBRATE", vibrate)
            }

            val pendingFlags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }

            val activityPendingIntent = PendingIntent.getActivity(
                reactContext,
                alarmId.hashCode(),
                fullScreenIntent,
                pendingFlags
            )

            val showIntent = Intent(reactContext, com.dayekup.MainActivity::class.java)
            val showPendingIntent = PendingIntent.getActivity(
                reactContext,
                alarmId.hashCode() + 1,
                showIntent,
                pendingFlags
            )

            val alarmClockInfo = AlarmManager.AlarmClockInfo(triggerTimeMs, showPendingIntent)
            alarmManager.setAlarmClock(alarmClockInfo, activityPendingIntent)

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_SCHEDULE_FAILED", e.message, e)
        }
    }

    @ReactMethod
    fun cancelAlarm(alarmId: String, promise: Promise) {
        try {
            val alarmManager = reactContext.getSystemService(Context.ALARM_SERVICE) as? AlarmManager

            val pendingFlags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }

            val fullScreenIntent = Intent(reactContext, com.dayekup.MainActivity::class.java).apply {
                action = "com.dayekup.ACTION_ALARM_FULLSCREEN"
            }
            val activityPendingIntent = PendingIntent.getActivity(
                reactContext,
                alarmId.hashCode(),
                fullScreenIntent,
                pendingFlags
            )
            alarmManager?.cancel(activityPendingIntent)

            val alarmIntent = Intent(reactContext, AlarmReceiver::class.java).apply {
                action = "com.dayekup.ACTION_ALARM_TRIGGER"
            }
            val broadcastPendingIntent = PendingIntent.getBroadcast(
                reactContext,
                alarmId.hashCode(),
                alarmIntent,
                pendingFlags
            )
            alarmManager?.cancel(broadcastPendingIntent)

            AlarmStorage.removeAlarm(reactContext, alarmId)
            AlarmReceiver.cancelNotification(reactContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_CANCEL_FAILED", e.message, e)
        }
    }

    @ReactMethod
    fun stopAlarmSound(promise: Promise) {
        try {
            AlarmAudioPlayer.stop()
            AlarmReceiver.cancelNotification(reactContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_STOP_SOUND", e.message, e)
        }
    }

    @ReactMethod
    fun playPreview(soundUri: String?, promise: Promise) {
        try {
            AlarmAudioPlayer.playPreview(reactContext, soundUri)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_PLAY_PREVIEW", e.message, e)
        }
    }

    @ReactMethod
    fun stopPreview(promise: Promise) {
        try {
            AlarmAudioPlayer.stopPreview()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_STOP_PREVIEW", e.message, e)
        }
    }

    @ReactMethod
    fun pickRingtone(currentUri: String?, promise: Promise) {
        val currentActivity = reactContext.currentActivity
        if (currentActivity == null) {
            promise.reject("ERR_NO_ACTIVITY", "Activity is not available to pick ringtone")
            return
        }

        try {
            ringtonePickerPromise = promise
            val intent = Intent(RingtoneManager.ACTION_RINGTONE_PICKER).apply {
                putExtra(
                    RingtoneManager.EXTRA_RINGTONE_TYPE,
                    RingtoneManager.TYPE_ALARM or RingtoneManager.TYPE_RINGTONE
                )
                putExtra(RingtoneManager.EXTRA_RINGTONE_TITLE, "Select Alarm Sound")
                putExtra(RingtoneManager.EXTRA_RINGTONE_SHOW_DEFAULT, true)
                putExtra(RingtoneManager.EXTRA_RINGTONE_SHOW_SILENT, false)
                if (!currentUri.isNullOrEmpty()) {
                    putExtra(RingtoneManager.EXTRA_RINGTONE_EXISTING_URI, Uri.parse(currentUri))
                }
            }
            currentActivity.startActivityForResult(intent, REQUEST_CODE_RINGTONE_PICKER)
        } catch (e: Exception) {
            ringtonePickerPromise = null
            promise.reject("ERR_PICK_RINGTONE", e.message, e)
        }
    }

    @ReactMethod
    fun pickAudioFile(promise: Promise) {
        val currentActivity = reactContext.currentActivity
        if (currentActivity == null) {
            promise.reject("ERR_NO_ACTIVITY", "Activity is not available to pick audio file")
            return
        }

        try {
            audioFilePickerPromise = promise
            val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "audio/*"
                flags = Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
            }
            currentActivity.startActivityForResult(intent, REQUEST_CODE_AUDIO_FILE_PICKER)
        } catch (e: Exception) {
            audioFilePickerPromise = null
            promise.reject("ERR_PICK_AUDIO", e.message, e)
        }
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_CODE_RINGTONE_PICKER) {
            val promise = ringtonePickerPromise
            ringtonePickerPromise = null
            if (promise != null) {
                if (resultCode == Activity.RESULT_OK && data != null) {
                    @Suppress("DEPRECATION")
                    val uri: Uri? = data.getParcelableExtra(RingtoneManager.EXTRA_RINGTONE_PICKED_URI)
                    if (uri != null) {
                        val ringtone = RingtoneManager.getRingtone(reactContext, uri)
                        val title = ringtone?.getTitle(reactContext) ?: "Selected Sound"
                        val result = Arguments.createMap().apply {
                            putString("uri", uri.toString())
                            putString("title", title)
                        }
                        promise.resolve(result)
                    } else {
                        promise.resolve(null)
                    }
                } else {
                    promise.resolve(null)
                }
            }
        } else if (requestCode == REQUEST_CODE_AUDIO_FILE_PICKER) {
            val promise = audioFilePickerPromise
            audioFilePickerPromise = null
            if (promise != null) {
                if (resultCode == Activity.RESULT_OK && data != null) {
                    val uri: Uri? = data.data
                    if (uri != null) {
                        try {
                            reactContext.contentResolver.takePersistableUriPermission(
                                uri,
                                Intent.FLAG_GRANT_READ_URI_PERMISSION
                            )
                        } catch (_: Exception) {
                            // Non-fatal if persistence fails for non-document providers
                        }
                        val title = getFileNameFromUri(uri)
                        val result = Arguments.createMap().apply {
                            putString("uri", uri.toString())
                            putString("title", title)
                        }
                        promise.resolve(result)
                    } else {
                        promise.resolve(null)
                    }
                } else {
                    promise.resolve(null)
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        // No-op for activity listener
    }

    private fun getFileNameFromUri(uri: Uri): String {
        var name = "Custom Song"
        try {
            reactContext.contentResolver.query(uri, null, null, null, null)?.use { cursor ->
                val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                if (nameIndex != -1 && cursor.moveToFirst()) {
                    name = cursor.getString(nameIndex) ?: name
                }
            }
        } catch (_: Exception) {
            // Fallback to last path segment if query fails
            uri.lastPathSegment?.let { name = it }
        }
        return name
    }

    @ReactMethod
    fun canScheduleExactAlarms(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val alarmManager = reactContext.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
            promise.resolve(alarmManager?.canScheduleExactAlarms() ?: false)
        } else {
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun requestExactAlarmPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                    data = Uri.parse("package:${reactContext.packageName}")
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(intent)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_EXACT_PERMISSION", e.message, e)
        }
    }

    @ReactMethod
    fun checkBatteryOptimization(promise: Promise) {
        val powerManager = reactContext.getSystemService(Context.POWER_SERVICE) as? PowerManager
        if (powerManager != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val isIgnoring = powerManager.isIgnoringBatteryOptimizations(reactContext.packageName)
            promise.resolve(isIgnoring)
        } else {
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun requestIgnoreBatteryOptimization(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                    data = Uri.parse("package:${reactContext.packageName}")
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(intent)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_BATTERY_OPT", e.message, e)
        }
    }

    @ReactMethod
    fun getInitialAlarm(promise: Promise) {
        val id = pendingAlarmId
        if (id != null) {
            val map = Arguments.createMap().apply {
                putString("alarmId", id)
            }
            promise.resolve(map)
        } else {
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun clearInitialAlarm(promise: Promise) {
        pendingAlarmId = null
        promise.resolve(true)
    }

    @ReactMethod
    fun canDrawOverlays(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            promise.resolve(Settings.canDrawOverlays(reactContext))
        } else {
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun requestOverlayPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:${reactContext.packageName}")
                ).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(intent)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            try {
                val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(intent)
                promise.resolve(true)
            } catch (ex: Exception) {
                promise.reject("ERR_OVERLAY_PERMISSION", ex.message, ex)
            }
        }
    }

    @ReactMethod
    fun canUseFullScreenIntent(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            try {
                val notificationManager =
                    reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
                val method = NotificationManager::class.java.getMethod("canUseFullScreenIntent")
                val result = method.invoke(notificationManager) as? Boolean ?: true
                promise.resolve(result)
            } catch (_: Exception) {
                promise.resolve(true)
            }
        } else {
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun requestFullScreenIntentPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                val intent = Intent("android.settings.MANAGE_APP_USE_FULL_SCREEN_INTENT").apply {
                    data = Uri.parse("package:${reactContext.packageName}")
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(intent)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_FULL_SCREEN_INTENT_PERMISSION", e.message, e)
        }
    }

    @ReactMethod
    fun openOEMSettings(promise: Promise) {
        openLockScreenPermissionSettings(promise)
    }

    @ReactMethod
    fun getDeviceBrand(promise: Promise) {
        val map = Arguments.createMap().apply {
            putString("brand", Build.BRAND)
            putString("manufacturer", Build.MANUFACTURER)
            val m = Build.MANUFACTURER.lowercase()
            val b = Build.BRAND.lowercase()
            val isXiaomi = m.contains("xiaomi") || m.contains("redmi") || m.contains("poco") ||
                           b.contains("xiaomi") || b.contains("redmi") || b.contains("poco")
            putBoolean("isXiaomi", isXiaomi)
        }
        promise.resolve(map)
    }

    @ReactMethod
    fun openLockScreenPermissionSettings(promise: Promise) {
        val packageName = reactContext.packageName
        val m = Build.MANUFACTURER.lowercase()
        val b = Build.BRAND.lowercase()
        val isXiaomi = m.contains("xiaomi") || m.contains("redmi") || m.contains("poco") ||
                       b.contains("xiaomi") || b.contains("redmi") || b.contains("poco")

        try {
            if (isXiaomi) {
                try {
                    val intent = Intent("miui.intent.action.APP_PERM_EDITOR").apply {
                        setClassName(
                            "com.miui.securitycenter",
                            "com.miui.permcenter.permissions.PermissionsEditorActivity"
                        )
                        putExtra("extra_pkgname", packageName)
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    reactContext.startActivity(intent)
                    promise.resolve(true)
                    return
                } catch (_: Exception) {
                    try {
                        val intent = Intent("miui.intent.action.APP_PERM_EDITOR").apply {
                            putExtra("extra_pkgname", packageName)
                            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        }
                        reactContext.startActivity(intent)
                        promise.resolve(true)
                        return
                    } catch (_: Exception) {}
                }
            }

            // Standard Overlay Permission (Android 10+ / 14+)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(reactContext)) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:$packageName")
                ).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(intent)
                promise.resolve(true)
                return
            }

            // Android 14+ Full-Screen Intent settings
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                try {
                    val intent = Intent("android.settings.MANAGE_APP_USE_FULL_SCREEN_INTENT").apply {
                        data = Uri.parse("package:$packageName")
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    reactContext.startActivity(intent)
                    promise.resolve(true)
                    return
                } catch (_: Exception) {}
            }

            // Fallback: App Details
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.parse("package:$packageName")
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            try {
                val intent = Intent(Settings.ACTION_SETTINGS).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(intent)
                promise.resolve(true)
            } catch (ex: Exception) {
                promise.reject("ERR_OPEN_LOCKSCREEN_SETTINGS", ex.message, ex)
            }
        }
    }

    @ReactMethod
    fun openAutoStartSettings(promise: Promise) {
        try {
            val intent = Intent().apply {
                component = android.content.ComponentName(
                    "com.miui.securitycenter",
                    "com.miui.permcenter.autostart.AutoStartManagementActivity"
                )
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
            promise.resolve(true)
        } catch (_: Exception) {
            try {
                val intent = Intent("miui.intent.action.OP_AUTO_START").apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(intent)
                promise.resolve(true)
            } catch (e: Exception) {
                openLockScreenPermissionSettings(promise)
            }
        }
    }

    @ReactMethod
    fun hasPromptedLockScreen(promise: Promise) {
        val prefs = reactContext.getSharedPreferences("DayekupPrefs", Context.MODE_PRIVATE)
        promise.resolve(prefs.getBoolean("has_prompted_lockscreen", false))
    }

    @ReactMethod
    fun markPromptedLockScreen(promise: Promise) {
        val prefs = reactContext.getSharedPreferences("DayekupPrefs", Context.MODE_PRIVATE)
        prefs.edit().putBoolean("has_prompted_lockscreen", true).apply()
        promise.resolve(true)
    }

    @ReactMethod
    fun saveAlarmsJson(alarmsJson: String, promise: Promise) {
        try {
            val prefs = reactContext.getSharedPreferences("DayekupAlarmItems", Context.MODE_PRIVATE)
            prefs.edit().putString("saved_alarms_json", alarmsJson).apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_SAVE_ALARMS", e.message, e)
        }
    }

    @ReactMethod
    fun getAlarmsJson(promise: Promise) {
        try {
            val prefs = reactContext.getSharedPreferences("DayekupAlarmItems", Context.MODE_PRIVATE)
            val json = prefs.getString("saved_alarms_json", "[]") ?: "[]"
            promise.resolve(json)
        } catch (e: Exception) {
            promise.resolve("[]")
        }
    }
}
