import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppIcon,
  AppText,
  CustomHeader,
  LockScreenPermissionModal,
  SafeAreaContainer,
  TimePickerModal,
} from '../../../components';
import {
  challengeIcons,
  commonString,
  createAlarmString,
  lockScreenPermissionString,
} from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { saveAlarm, deleteAlarm } from '../../../redux';
import {
  AlarmItem,
  ChallengeDifficulty,
  ChallengeType,
  RootStackParamList,
} from '../../../types';
import { AlarmService } from '../../../services';
import {
  calculateRestDuration,
  formatTwoDigits,
  getCurrentTime12,
  getTodayDayIndex,
} from '../../../utils';
import { Colors } from '../../../theme/Colors';
import { styles } from './CreateAlarmScreenStyles';

type CreateAlarmRouteProp = RouteProp<
  RootStackParamList,
  'CreateAlarmScreen'
>;
type CreateAlarmNavProp = NativeStackNavigationProp<RootStackParamList>;

const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const CHALLENGES: {
  type: ChallengeType;
  label: string;
  subtitle: string;
}[] = [
  { type: 'knife', label: createAlarmString.challengeKnife, subtitle: createAlarmString.subKnife },
  { type: 'hockey', label: createAlarmString.challengeHockey, subtitle: createAlarmString.subHockey },
  { type: 'stack', label: createAlarmString.challengeStack, subtitle: createAlarmString.subStack },
  { type: 'pong', label: createAlarmString.challengePong, subtitle: createAlarmString.subPong },
  { type: 'truck', label: createAlarmString.challengeTruck, subtitle: createAlarmString.subTruck },
  { type: 'duel', label: createAlarmString.challengeDuel, subtitle: createAlarmString.subDuel },
  { type: 'math', label: createAlarmString.challengeMath, subtitle: createAlarmString.subMath },
  { type: 'mystery', label: createAlarmString.challengeMystery, subtitle: createAlarmString.subMystery },
];

const DIFFICULTIES: {
  level: ChallengeDifficulty;
  label: string;
}[] = [
  { level: 'easy', label: createAlarmString.easy },
  { level: 'medium', label: createAlarmString.medium },
  { level: 'hard', label: createAlarmString.hard },
];

const CreateAlarmScreen: FC = () => {
  const navigation = useNavigation<CreateAlarmNavProp>();
  const route = useRoute<CreateAlarmRouteProp>();
  const dispatch = useAppDispatch();

  const alarms = useAppSelector(state => state.alarm.alarms);
  const editingAlarm = alarms.find(a => a.id === route.params?.alarmId);

  const [alarmName, setAlarmName] = useState<string>(
    editingAlarm?.label || editingAlarm?.title || createAlarmString.defaultAlarmName,
  );

  const [initialTime] = useState(() => {
    if (editingAlarm) {
      return {
        hour: editingAlarm.hour,
        minute: editingAlarm.minute,
        period: editingAlarm.period,
      };
    }
    return getCurrentTime12();
  });

  const [hour, setHour] = useState<string>(initialTime.hour);
  const [minute, setMinute] = useState<string>(initialTime.minute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialTime.period);

  const restCalculatedText = useMemo(() => {
    return (
      calculateRestDuration(hour, minute, period) ||
      createAlarmString.restCalculated
    );
  }, [hour, minute, period]);
  const [repeatDays, setRepeatDays] = useState<number[]>(
    editingAlarm?.repeatDays || [getTodayDayIndex()],
  );
  const [challengeType, setChallengeType] = useState<ChallengeType>(
    editingAlarm?.challengeType || 'math',
  );
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty>(
    editingAlarm?.difficulty || 'medium',
  );
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(
    editingAlarm?.vibrationEnabled !== false,
  );
  const [soundUri, setSoundUri] = useState<string | undefined>(
    editingAlarm?.soundUri,
  );
  const [soundTitle, setSoundTitle] = useState<string>(
    editingAlarm?.soundTitle || createAlarmString.soundDefault,
  );
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [isSoundModalVisible, setIsSoundModalVisible] = useState<boolean>(false);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState<boolean>(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState<boolean>(false);
  const [isXiaomi, setIsXiaomi] = useState<boolean>(false);

  // Fetch device brand information on mount
  useEffect(() => {
    AlarmService.getDeviceBrand().then(brandInfo => {
      setIsXiaomi(Boolean(brandInfo?.isXiaomi));
    });
  }, []);

  // Stop sound preview on component unmount
  useEffect(() => {
    return () => {
      AlarmService.stopPreview();
    };
  }, []);

  const handleConfirmTime = useCallback(
    (newHour: string, newMinute: string, newPeriod: 'AM' | 'PM') => {
      setHour(newHour);
      setMinute(newMinute);
      setPeriod(newPeriod);
      setIsTimeModalVisible(false);
    },
    [],
  );

  // Time increment / decrement helper (5m, 15m)
  const adjustMinutes = (delta: number) => {
    let currentHour24 = parseInt(hour, 10);
    if (period === 'PM' && currentHour24 < 12) {
      currentHour24 += 12;
    } else if (period === 'AM' && currentHour24 === 12) {
      currentHour24 = 0;
    }

    let totalMinutes = currentHour24 * 60 + parseInt(minute, 10) + delta;
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }
    totalMinutes = totalMinutes % (24 * 60);

    const newH24 = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;

    let newPeriod: 'AM' | 'PM' = 'AM';
    let newH12 = newH24;

    if (newH24 === 0) {
      newH12 = 12;
      newPeriod = 'AM';
    } else if (newH24 === 12) {
      newH12 = 12;
      newPeriod = 'PM';
    } else if (newH24 > 12) {
      newH12 = newH24 - 12;
      newPeriod = 'PM';
    } else {
      newPeriod = 'AM';
    }

    setHour(formatTwoDigits(newH12));
    setMinute(formatTwoDigits(newM));
    setPeriod(newPeriod);
  };

  const toggleDay = (dayIndex: number) => {
    if (repeatDays.includes(dayIndex)) {
      setRepeatDays(repeatDays.filter(d => d !== dayIndex));
    } else {
      setRepeatDays([...repeatDays, dayIndex].sort());
    }
  };

  const getRepeatSubtitle = () => {
    if (repeatDays.length === 7) return createAlarmString.everydayLabel;
    if (
      repeatDays.length === 5 &&
      [0, 1, 2, 3, 4].every(d => repeatDays.includes(d))
    ) {
      return createAlarmString.weekdaysLabel;
    }
    return `${repeatDays.length} days`;
  };

  const handleTogglePreview = async () => {
    if (isPlayingPreview) {
      await AlarmService.stopPreview();
      setIsPlayingPreview(false);
    } else {
      setIsPlayingPreview(true);
      await AlarmService.playPreview(soundUri);
    }
  };

  const handlePickRingtone = async () => {
    setIsSoundModalVisible(false);
    const result = await AlarmService.pickRingtone(soundUri);
    if (result) {
      setSoundUri(result.uri);
      setSoundTitle(result.title);
      if (isPlayingPreview) {
        await AlarmService.playPreview(result.uri);
      }
    }
  };

  const handlePickAudioFile = async () => {
    setIsSoundModalVisible(false);
    const result = await AlarmService.pickAudioFile();
    if (result) {
      setSoundUri(result.uri);
      setSoundTitle(result.title);
      if (isPlayingPreview) {
        await AlarmService.playPreview(result.uri);
      }
    }
  };

  const executeSave = () => {
    AlarmService.stopPreview();
    const finalName = alarmName.trim() || createAlarmString.defaultAlarmName;
    const alarmToSave: AlarmItem = {
      id: editingAlarm?.id || `alarm-${Date.now()}`,
      title: finalName,
      label: finalName,
      hour,
      minute,
      period,
      enabled: true,
      repeatDays,
      challengeType,
      difficulty,
      soundUri,
      soundTitle,
      vibrationEnabled,
      motivationalQuote: createAlarmString.defaultQuote,
      createdAt: editingAlarm?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(saveAlarm(alarmToSave));
    AlarmService.schedule(alarmToSave);

    // Persist full alarm items list so it survives app kills and device reboots
    const otherAlarms = alarms.filter(a => a.id !== alarmToSave.id);
    const updatedAlarms = [alarmToSave, ...otherAlarms];
    AlarmService.saveAllAlarms(updatedAlarms);

    navigation.goBack();
  };

  const handleSave = async () => {
    const canOverlay = await AlarmService.canDrawOverlays();
    const canFullScreen = await AlarmService.canUseFullScreenIntent();

    if (!canOverlay || !canFullScreen) {
      setIsPermissionModalVisible(true);
    } else {
      executeSave();
    }
  };

  const handleOpenPermissionSettings = async () => {
    setIsPermissionModalVisible(false);
    await AlarmService.openLockScreenPermissionSettings();
    executeSave();
  };

  const handleDismissPermissionModal = () => {
    setIsPermissionModalVisible(false);
  };

  const handleSaveAnyway = () => {
    setIsPermissionModalVisible(false);
    executeSave();
  };

  const handleDelete = () => {
    if (!editingAlarm) return;
    Alert.alert(
      createAlarmString.deleteAlarmTitle,
      createAlarmString.deleteAlarmMsg,
      [
        { text: commonString.cancel, style: 'cancel' },
        {
          text: createAlarmString.deleteBtn,
          style: 'destructive',
          onPress: () => {
            AlarmService.stopPreview();
            AlarmService.cancel(editingAlarm.id);
            dispatch(deleteAlarm(editingAlarm.id));
            const updatedAlarms = alarms.filter(a => a.id !== editingAlarm.id);
            AlarmService.saveAllAlarms(updatedAlarms);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const getPuzzlePreviewText = () => {
    switch (challengeType) {
      case 'knife':
        return createAlarmString.knifeSample;
      case 'hockey':
        return createAlarmString.hockeySample;
      case 'stack':
        return createAlarmString.stackSample;
      case 'pong':
        return createAlarmString.pongSample;
      case 'truck':
        return createAlarmString.truckSample;
      case 'duel':
        return createAlarmString.duelSample;
      case 'math':
        return createAlarmString.mathSampleEquation;
      case 'mystery':
        return createAlarmString.mysterySample;
      case 'memory':
        return createAlarmString.memorySample;
      case 'pattern':
        return createAlarmString.patternSample;
      case 'reaction':
        return createAlarmString.reactionSample;
      default:
        return createAlarmString.knifeSample;
    }
  };

  return (
    <SafeAreaContainer
      edges={['top', 'left', 'right', 'bottom']}
      backgroundColor={Colors.creamBackground}>
      <CustomHeader
        title={
          editingAlarm
            ? createAlarmString.editHeaderTitle
            : createAlarmString.headerTitle
        }
        showBack={true}
        showAvatar={false}
        onBackPress={() => {
          AlarmService.stopPreview();
          navigation.goBack();
        }}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Rest Calculated Pill */}
        <View style={styles.restPillContainer}>
          <AppIcon
            name="moon"
            size="xs"
            color={Colors.brandOrange}
            style={styles.restPillIcon}
          />
          <AppText style={styles.restPillText}>{restCalculatedText}</AppText>
        </View>

        {/* 1. Time Adjuster Card */}
        <View style={styles.sectionCard}>
          <View style={styles.timeAdjusterRow}>
            <TouchableOpacity
              style={styles.timeStepBtn}
              onPress={() => adjustMinutes(-1)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={createAlarmString.minus15m}
              accessibilityRole="button">
              <AppIcon name="minus" size="lg" color={Colors.textDark} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeDisplayCenter}
              onPress={() => setIsTimeModalVisible(true)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={`${createAlarmString.selectTimeModalTitle}: ${hour}:${minute} ${period}`}
              accessibilityRole="button">
              <AppText style={styles.timeDigitsText}>
                {hour}:{minute}
              </AppText>
              <AppText style={styles.periodText}>{period}</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeStepBtn}
              onPress={() => adjustMinutes(1)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={createAlarmString.plus15m}
              accessibilityRole="button">
              <AppIcon name="plus" size="lg" color={Colors.textDark} />
            </TouchableOpacity>
          </View>

          {/* Quick Adjustment Chips */}
          <View style={styles.quickChipsRow}>
            <TouchableOpacity
              style={styles.quickChipBtn}
              onPress={() => adjustMinutes(-15)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={createAlarmString.minus15m}
              accessibilityRole="button">
              <AppText style={styles.quickChipText}>
                {createAlarmString.minus15m}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickChipBtn}
              onPress={() => adjustMinutes(-5)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={createAlarmString.minus5m}
              accessibilityRole="button">
              <AppText style={styles.quickChipText}>
                {createAlarmString.minus5m}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickChipBtn}
              onPress={() => adjustMinutes(5)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={createAlarmString.plus5m}
              accessibilityRole="button">
              <AppText style={styles.quickChipText}>
                {createAlarmString.plus5m}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickChipBtn}
              onPress={() => adjustMinutes(15)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={createAlarmString.plus15m}
              accessibilityRole="button">
              <AppText style={styles.quickChipText}>
                {createAlarmString.plus15m}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Alarm Name & Schedule Card */}
        <View style={styles.sectionCard}>
          <AppText style={styles.fieldLabel}>
            {createAlarmString.alarmNameLabel}
          </AppText>
          <View style={styles.inputBox}>
            <AppIcon
              name="alarmClock"
              size="sm"
              color={Colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInputField}
              value={alarmName}
              onChangeText={setAlarmName}
              placeholder={createAlarmString.defaultAlarmName}
              placeholderTextColor={Colors.textMuted}
              maxLength={40}
              accessible={true}
              accessibilityLabel={createAlarmString.alarmNameLabel}
            />
          </View>

          <View style={styles.repeatHeaderRow}>
            <AppText style={styles.repeatScheduleTitle}>
              {createAlarmString.repeatScheduleLabel}
            </AppText>
            <AppText style={styles.repeatScheduleValue}>
              {getRepeatSubtitle()}
            </AppText>
          </View>

          {/* Day of Week Chips */}
          <View style={styles.daysGrid}>
            {DAYS_SHORT.map((day, idx) => {
              const isSelected = repeatDays.includes(idx);
              return (
                <TouchableOpacity
                  key={`day-${idx}`}
                  style={[
                    styles.dayChip,
                    isSelected && styles.dayChipSelected,
                  ]}
                  onPress={() => toggleDay(idx)}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityLabel={`Day ${day}`}
                  accessibilityRole="button">
                  <AppText
                    style={[
                      styles.dayChipText,
                      isSelected && styles.dayChipTextSelected,
                    ]}>
                    {day}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. Vision & Motivation Card */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <AppText style={styles.cardHeaderTitle}>
              {createAlarmString.visionMotivationHeading}
            </AppText>

            <TouchableOpacity
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={createAlarmString.changePhoto}
              accessibilityRole="button">
              <AppText style={styles.actionTextBtn}>
                {createAlarmString.changePhoto}
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.visionImageBox}>
            <View style={styles.visionImageOverlay} />
            <View style={styles.visionOverlayBottom}>
              <View>
                <AppText style={styles.wakeIntentionTag}>
                  {createAlarmString.wakeUpIntention}
                </AppText>
                <AppText style={styles.quoteText}>
                  {createAlarmString.defaultQuote}
                </AppText>
              </View>
              <AppIcon name="pencil" size="sm" color={Colors.white} />
            </View>
          </View>
        </View>

        {/* 4. Wake-Up Challenge Card */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <View>
              <AppText style={styles.cardHeaderTitle}>
                {createAlarmString.wakeUpChallengeHeading}
              </AppText>
              <AppText style={styles.cardHeaderSubtitle}>
                {createAlarmString.wakeUpChallengeSub}
              </AppText>
            </View>
          </View>

          {/* 6 Challenge Grid (3 rows x 2 columns) */}
          <View style={styles.challengesGrid}>
            {CHALLENGES.map(item => {
              const isSelected = challengeType === item.type;
              return (
                <TouchableOpacity
                  key={item.type}
                  style={[
                    styles.challengeCard,
                    isSelected && styles.challengeCardSelected,
                  ]}
                  onPress={() => setChallengeType(item.type)}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityLabel={item.label}
                  accessibilityRole="button">
                  <View style={styles.challengeCardTop}>
                    <View
                      style={[
                        styles.challengeIconBox,
                        isSelected && styles.challengeIconBoxSelected,
                      ]}>
                      <AppIcon
                        name={challengeIcons[item.type]}
                        size="md"
                        color={isSelected ? Colors.white : Colors.brandOrange}
                      />
                    </View>
                    <View
                      style={[
                        styles.challengeCheckCircle,
                        isSelected && styles.challengeCheckCircleSelected,
                      ]}>
                      {isSelected ? (
                        <AppIcon
                          name="check"
                          size="xs"
                          strokeWidth={3}
                          color={Colors.white}
                        />
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.challengeMetaBox}>
                    <AppText
                      style={[
                        styles.challengeTitle,
                        isSelected && styles.challengeTitleSelected,
                      ]}
                      numberOfLines={1}>
                      {item.label}
                    </AppText>
                    <AppText
                      style={[
                        styles.challengeSubtitle,
                        isSelected && styles.challengeSubtitleSelected,
                      ]}
                      numberOfLines={1}>
                      {item.subtitle}
                    </AppText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Difficulty Level Segment */}
          <View style={styles.difficultyRow}>
            <AppText style={styles.difficultyLabel}>
              {createAlarmString.difficultyLevel}
            </AppText>

            <View style={styles.difficultySegment}>
              {DIFFICULTIES.map(item => {
                const isSelected = difficulty === item.level;
                return (
                  <TouchableOpacity
                    key={item.level}
                    style={[
                      styles.diffBtn,
                      isSelected && styles.diffBtnSelected,
                    ]}
                    onPress={() => setDifficulty(item.level)}
                    activeOpacity={0.8}>
                    <AppText
                      style={[
                        styles.diffBtnText,
                        isSelected && styles.diffBtnTextSelected,
                      ]}>
                      {item.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Dynamic Mission Preview Bar */}
          <View style={styles.puzzlePreviewBar}>
            <View style={styles.puzzlePreviewLeft}>
              <AppIcon
                name="clock"
                size="sm"
                color={Colors.textMuted}
                style={styles.puzzleTimerIcon}
              />
              <AppText style={styles.puzzleEquationText} numberOfLines={2}>
                {getPuzzlePreviewText()}
              </AppText>
            </View>
            <AppText style={styles.timeLimitText}>
              {createAlarmString.timeLimit30s}
            </AppText>
          </View>
        </View>

        {/* 5. Sound & Physical Affordances Card */}
        <View style={styles.sectionCard}>
          {/* Sound Row */}
          <View style={styles.settingRow}>
            <TouchableOpacity
              style={styles.soundInfoTouchable}
              onPress={() => setIsSoundModalVisible(true)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={`${createAlarmString.soundHeading}: ${soundTitle}`}
              accessibilityRole="button">
              <View style={styles.settingIconCircle}>
                <AppIcon name="music" size="md" color={Colors.brandOrange} />
              </View>
              <View style={styles.soundTextCol}>
                <AppText style={styles.settingTitle}>
                  {createAlarmString.soundHeading}
                </AppText>
                <AppText style={styles.settingSub} numberOfLines={1}>
                  {soundTitle}
                </AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.previewSoundBtn,
                isPlayingPreview && styles.previewSoundBtnActive,
              ]}
              onPress={handleTogglePreview}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={
                isPlayingPreview
                  ? createAlarmString.stopPreview
                  : createAlarmString.preview
              }
              accessibilityRole="button">
              <AppText
                style={[
                  styles.previewSoundText,
                  isPlayingPreview && styles.previewSoundTextActive,
                ]}>
                {isPlayingPreview
                  ? createAlarmString.stopPreview
                  : createAlarmString.preview}
              </AppText>
              <AppIcon
                name={isPlayingPreview ? 'square' : 'play'}
                size="xs"
                color={isPlayingPreview ? Colors.white : Colors.brandOrange}
              />
            </TouchableOpacity>
          </View>

          {/* Vibration Row */}
          <View style={styles.settingRow}>
            <View style={styles.settingRowLeft}>
              <View
                style={[
                  styles.settingIconCircle,
                  styles.settingIconCircleGray,
                ]}>
                <AppIcon name="vibrate" size="md" color={Colors.textSecondary} />
              </View>
              <View>
                <AppText style={styles.settingTitle}>
                  {createAlarmString.vibrationHeading}
                </AppText>
                <AppText style={styles.settingSub}>
                  {createAlarmString.vibrationSub}
                </AppText>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.toggleTrack,
                !vibrationEnabled && styles.toggleTrackOff,
              ]}
              onPress={() => setVibrationEnabled(!vibrationEnabled)}
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel={createAlarmString.vibrationHeading}
              accessibilityRole="switch"
              accessibilityState={{ checked: vibrationEnabled }}>
              <View
                style={[
                  styles.toggleThumb,
                  !vibrationEnabled && styles.toggleThumbOff,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Primary Action: Full-width Save Button */}
        <TouchableOpacity
          style={styles.saveAlarmBtn}
          onPress={handleSave}
          activeOpacity={0.85}
          accessible={true}
          accessibilityLabel={createAlarmString.saveAlarmBtn}
          accessibilityRole="button">
          <AppText style={styles.saveAlarmBtnText}>
            {createAlarmString.saveAlarmBtn}
          </AppText>
        </TouchableOpacity>

        {/* Delete button (if editing existing alarm) */}
        {editingAlarm && (
          <TouchableOpacity
            style={styles.deleteAlarmBtn}
            onPress={handleDelete}
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel={createAlarmString.deleteAlarmTitle}
            accessibilityRole="button">
            <AppIcon name="trash" size="sm" color={Colors.error} />
            <AppText style={styles.deleteAlarmBtnText}>
              {createAlarmString.deleteAlarmTitle}
            </AppText>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Hour & Minute Modal Selection */}
      <TimePickerModal
        visible={isTimeModalVisible}
        initialHour={hour}
        initialMinute={minute}
        initialPeriod={period}
        onConfirm={handleConfirmTime}
        onCancel={() => setIsTimeModalVisible(false)}
      />

      {/* Sound Selection Bottom Modal */}
      <Modal
        visible={isSoundModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSoundModalVisible(false)}>
        <TouchableOpacity
          style={styles.soundModalOverlay}
          activeOpacity={1}
          onPress={() => setIsSoundModalVisible(false)}>
          <View style={styles.soundModalContainer}>
            <View style={styles.soundModalIndicator} />

            <View style={styles.soundModalHeader}>
              <AppText style={styles.soundModalTitle}>
                {createAlarmString.selectSoundTitle}
              </AppText>
              <AppText style={styles.soundModalSub}>
                {createAlarmString.selectSoundSubtitle}
              </AppText>
            </View>

            {/* Option 1: System Ringtones */}
            <TouchableOpacity
              style={styles.soundOptionBtn}
              onPress={handlePickRingtone}
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel={createAlarmString.soundRingtoneOption}
              accessibilityRole="button">
              <View style={styles.soundOptionLeft}>
                <View style={styles.soundOptionIconCircle}>
                  <AppIcon name="bell" size="md" color={Colors.brandOrange} />
                </View>
                <View style={styles.soundOptionTexts}>
                  <AppText style={styles.soundOptionTitle}>
                    {createAlarmString.soundRingtoneOption}
                  </AppText>
                  <AppText style={styles.soundOptionDesc}>
                    {createAlarmString.soundDefault}
                  </AppText>
                </View>
              </View>
              <AppIcon name="chevronRight" size="md" color={Colors.textMuted} />
            </TouchableOpacity>

            {/* Option 2: Device Songs / Music files */}
            <TouchableOpacity
              style={styles.soundOptionBtn}
              onPress={handlePickAudioFile}
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel={createAlarmString.soundDeviceMusicOption}
              accessibilityRole="button">
              <View style={styles.soundOptionLeft}>
                <View
                  style={[
                    styles.soundOptionIconCircle,
                    styles.soundOptionIconCirclePurple,
                  ]}>
                  <AppIcon name="folder" size="md" color={Colors.brandPurple} />
                </View>
                <View style={styles.soundOptionTexts}>
                  <AppText style={styles.soundOptionTitle}>
                    {createAlarmString.soundDeviceMusicOption}
                  </AppText>
                  <AppText style={styles.soundOptionDesc}>
                    {createAlarmString.soundCustom}
                  </AppText>
                </View>
              </View>
              <AppIcon name="chevronRight" size="md" color={Colors.textMuted} />
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.soundModalCancelBtn}
              onPress={() => setIsSoundModalVisible(false)}
              activeOpacity={0.8}>
              <AppText style={styles.soundModalCancelText}>
                {commonString.cancel}
              </AppText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Lock Screen & Background Overlay Permission Prompt Modal */}
      <LockScreenPermissionModal
        visible={isPermissionModalVisible}
        isXiaomi={isXiaomi}
        onOpenSettings={handleOpenPermissionSettings}
        onDismiss={handleDismissPermissionModal}
        onSecondaryAction={handleSaveAnyway}
        primaryButtonText={lockScreenPermissionString.openSettingsBtn}
        secondaryButtonText={lockScreenPermissionString.saveAnywayBtn}
      />
    </SafeAreaContainer>
  );
};

export default memo(CreateAlarmScreen);
