package com.dayekup.alarm

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.Ringtone
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.os.VibrationAttributes
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager

object AlarmAudioPlayer {
    private var mediaPlayer: MediaPlayer? = null
    private var fallbackRingtone: Ringtone? = null
    private var vibrator: Vibrator? = null
    private var audioFocusRequest: AudioFocusRequest? = null
    private var wakeLock: PowerManager.WakeLock? = null

    private var previewMediaPlayer: MediaPlayer? = null
    private var previewRingtone: Ringtone? = null

    @Synchronized
    fun start(context: Context, soundUriString: String? = null, vibrate: Boolean = true) {
        stop()

        // 1. Acquire dedicated WakeLock to keep CPU running continuously while alarm is active
        try {
            val powerManager = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
            wakeLock = powerManager?.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP,
                "Dayekup:AlarmAudioPlayerWakeLock"
            )?.apply {
                acquire(10 * 60 * 1000L) // 10 minutes maximum alarm duration
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager

        // 2. Ensure alarm volume is audible (at least 80% of maximum alarm volume)
        try {
            audioManager?.let { am ->
                val maxVol = am.getStreamMaxVolume(AudioManager.STREAM_ALARM)
                val currentVol = am.getStreamVolume(AudioManager.STREAM_ALARM)
                val targetVol = (maxVol * 0.85).toInt().coerceAtLeast(1)
                if (currentVol < targetVol) {
                    am.setStreamVolume(AudioManager.STREAM_ALARM, targetVol, 0)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // 3. Request Audio Focus
        try {
            audioManager?.let { am ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    val attributes = AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                    val req = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE)
                        .setAudioAttributes(attributes)
                        .setAcceptsDelayedFocusGain(true)
                        .build()
                    audioFocusRequest = req
                    am.requestAudioFocus(req)
                } else {
                    @Suppress("DEPRECATION")
                    am.requestAudioFocus(
                        null,
                        AudioManager.STREAM_ALARM,
                        AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE
                    )
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // 4. Resolve target sound URI
        var targetUri: Uri? = null
        if (!soundUriString.isNullOrEmpty()) {
            try {
                targetUri = Uri.parse(soundUriString)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        if (targetUri == null) {
            targetUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        }

        // 5. Play audio using MediaPlayer with indefinite looping & auto-restart on completion
        var playbackStarted = false
        if (targetUri != null) {
            try {
                val mp = MediaPlayer()
                mp.setWakeMode(context, PowerManager.PARTIAL_WAKE_LOCK)

                try {
                    mp.setDataSource(context, targetUri)
                } catch (e: Exception) {
                    // Try AssetFileDescriptor as fallback for content:// URIs
                    context.contentResolver.openAssetFileDescriptor(targetUri, "r")?.use { afd ->
                        mp.setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                    } ?: throw e
                }

                mp.setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                mp.prepare()
                mp.isLooping = true
                // Guarantees looping even if underlying codec does not support loop flag
                mp.setOnCompletionListener { player ->
                    try {
                        player.seekTo(0)
                        player.start()
                    } catch (ex: Exception) {
                        ex.printStackTrace()
                    }
                }
                mp.start()
                mediaPlayer = mp
                playbackStarted = true
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        // Fallback: If MediaPlayer failed, try RingtoneManager ringtone
        if (!playbackStarted) {
            try {
                val fallbackUri = targetUri
                    ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                    ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)

                fallbackUri?.let { uri ->
                    val rt = RingtoneManager.getRingtone(context, uri)
                    if (rt != null) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                            rt.isLooping = true
                        }
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                            rt.audioAttributes = AudioAttributes.Builder()
                                .setUsage(AudioAttributes.USAGE_ALARM)
                                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                                .build()
                        }
                        rt.play()
                        fallbackRingtone = rt
                        playbackStarted = true
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        // 6. Vibration (with USAGE_ALARM attribute so it vibrates even in DND/Silent modes)
        if (vibrate) {
            try {
                vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    val vibratorManager =
                        context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                    vibratorManager?.defaultVibrator
                } else {
                    @Suppress("DEPRECATION")
                    context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                }

                val pattern = longArrayOf(0, 1000, 500, 1000, 500)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    val vibrationAttributes = VibrationAttributes.Builder()
                        .setUsage(VibrationAttributes.USAGE_ALARM)
                        .build()
                    vibrator?.vibrate(
                        VibrationEffect.createWaveform(pattern, 0),
                        vibrationAttributes
                    )
                } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    val audioAttributes = AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                    vibrator?.vibrate(
                        VibrationEffect.createWaveform(pattern, 0),
                        audioAttributes
                    )
                } else {
                    @Suppress("DEPRECATION")
                    vibrator?.vibrate(pattern, 0)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    @Synchronized
    fun playPreview(context: Context, soundUriString: String? = null) {
        stopPreview()

        var uri: Uri? = null
        if (!soundUriString.isNullOrEmpty()) {
            try {
                uri = Uri.parse(soundUriString)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        if (uri == null) {
            uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
        }

        if (uri == null) return

        try {
            val mp = MediaPlayer()
            try {
                mp.setDataSource(context, uri)
            } catch (e: Exception) {
                context.contentResolver.openAssetFileDescriptor(uri, "r")?.use { afd ->
                    mp.setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                } ?: throw e
            }

            mp.setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build()
            )
            mp.prepare()
            mp.isLooping = true
            mp.start()
            previewMediaPlayer = mp
        } catch (e: Exception) {
            // Fallback to Ringtone for preview
            try {
                val rt = RingtoneManager.getRingtone(context, uri)
                rt?.play()
                previewRingtone = rt
            } catch (ex: Exception) {
                ex.printStackTrace()
            }
        }
    }

    @Synchronized
    fun stopPreview() {
        try {
            previewMediaPlayer?.let {
                if (it.isPlaying) {
                    it.stop()
                }
                it.release()
            }
            previewMediaPlayer = null
        } catch (e: Exception) {
            e.printStackTrace()
        }

        try {
            previewRingtone?.stop()
            previewRingtone = null
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @Synchronized
    fun stop() {
        stopPreview()

        try {
            mediaPlayer?.let {
                if (it.isPlaying) {
                    it.stop()
                }
                it.release()
            }
            mediaPlayer = null
        } catch (e: Exception) {
            e.printStackTrace()
        }

        try {
            fallbackRingtone?.stop()
            fallbackRingtone = null
        } catch (e: Exception) {
            e.printStackTrace()
        }

        try {
            vibrator?.cancel()
            vibrator = null
        } catch (e: Exception) {
            e.printStackTrace()
        }

        try {
            wakeLock?.let {
                if (it.isHeld) {
                    it.release()
                }
            }
            wakeLock = null
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
