import React, { FC, memo, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppText,
  CustomHeader,
  SafeAreaContainer,
} from '../../../components';
import { createAlarmString } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { saveAlarm } from '../../../redux';
import {
  AlarmItem,
  ChallengeDifficulty,
  ChallengeType,
  RootStackParamList,
} from '../../../types';
import { AlarmService } from '../../../services';
import { styles } from './CreateAlarmScreenStyles';
import { formatTwoDigits } from '../../../utils';

type CreateAlarmRouteProp = RouteProp<
  RootStackParamList,
  'CreateAlarmScreen'
>;
type CreateAlarmNavProp = NativeStackNavigationProp<RootStackParamList>;

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const CreateAlarmScreen: FC = () => {
  const navigation = useNavigation<CreateAlarmNavProp>();
  const route = useRoute<CreateAlarmRouteProp>();
  const dispatch = useAppDispatch();

  const alarms = useAppSelector(state => state.alarm.alarms);
  const editingAlarm = alarms.find(a => a.id === route.params?.alarmId);

  const [hour, setHour] = useState<string>(editingAlarm?.hour || '06');
  const [minute, setMinute] = useState<string>(editingAlarm?.minute || '30');
  const [period, setPeriod] = useState<'AM' | 'PM'>(editingAlarm?.period || 'AM');
  const [repeatDays, setRepeatDays] = useState<number[]>(
    editingAlarm?.repeatDays || [0, 1, 2, 3, 4],
  );
  const [challengeType, setChallengeType] = useState<ChallengeType>(
    editingAlarm?.challengeType || 'math',
  );
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty>(
    editingAlarm?.difficulty || 'medium',
  );
  const [snoozePenalty, setSnoozePenalty] = useState<boolean>(
    editingAlarm?.snoozePenalty ?? true,
  );

  const handleAdjustTime = (deltaMinutes: number) => {
    let totalMins = parseInt(hour, 10) * 60 + parseInt(minute, 10) + deltaMinutes;
    if (totalMins < 0) totalMins += 24 * 60;
    totalMins = totalMins % (24 * 60);

    const newH = Math.floor(totalMins / 60);
    const newM = totalMins % 60;

    setHour(formatTwoDigits(newH === 0 ? 12 : newH > 12 ? newH - 12 : newH));
    setMinute(formatTwoDigits(newM));
  };

  const handleToggleDay = (dayIdx: number) => {
    if (repeatDays.includes(dayIdx)) {
      setRepeatDays(repeatDays.filter(d => d !== dayIdx));
    } else {
      setRepeatDays([...repeatDays, dayIdx].sort());
    }
  };

  const handleSave = async () => {
    const alarmToSave: AlarmItem = {
      id: editingAlarm?.id || `alarm-${Date.now()}`,
      hour,
      minute,
      period,
      title: 'Morning Wake Up • Tomorrow',
      enabled: true,
      repeatDays,
      motivationalImage:
        editingAlarm?.motivationalImage ||
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      motivationalQuote:
        editingAlarm?.motivationalQuote ||
        createAlarmString.quote,
      challengeType,
      difficulty,
      snoozePenalty,
      createdAt: editingAlarm?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(saveAlarm(alarmToSave));
    await AlarmService.schedule(alarmToSave);
    navigation.goBack();
  };

  return (
    <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
      <CustomHeader
        title={createAlarmString.headerTitle}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <View style={styles.headerActionsRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerCancelBtn}>
              <AppText style={styles.headerCancelText}>Cancel</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={styles.headerSaveBtn}>
              <AppText style={styles.headerSaveText}>Save</AppText>
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Status Badge Row */}
        <View style={styles.statusRow}>
          <View style={styles.questSetupPill}>
            <AppText>⭐</AppText>
            <AppText style={styles.questSetupText}>
              {createAlarmString.questSetup}
            </AppText>
          </View>

          <View style={styles.heroModePill}>
            <AppText style={styles.heroModeText}>
              {createAlarmString.heroMode}
            </AppText>
          </View>
        </View>

        {/* Wake Horizon Card */}
        <View style={styles.horizonCard}>
          <AppText style={styles.horizonLabel}>
            {createAlarmString.wakeHorizon}
          </AppText>

          <View style={styles.timePickerRow}>
            <AppText style={styles.timeBigDigit}>{hour}</AppText>
            <AppText style={styles.timeColon}>:</AppText>
            <AppText style={styles.timeBigDigit}>{minute}</AppText>

            <View style={styles.periodToggleContainer}>
              <TouchableOpacity
                onPress={() => setPeriod('AM')}
                style={[
                  styles.periodButton,
                  period === 'AM' && styles.periodButtonActive,
                ]}>
                <AppText
                  style={[
                    styles.periodButtonText,
                    period === 'AM' && styles.periodButtonTextActive,
                  ]}>
                  {createAlarmString.am}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPeriod('PM')}
                style={[
                  styles.periodButton,
                  period === 'PM' && styles.periodButtonActive,
                ]}>
                <AppText
                  style={[
                    styles.periodButtonText,
                    period === 'PM' && styles.periodButtonTextActive,
                  ]}>
                  {createAlarmString.pm}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.scrubbersRow}>
            <TouchableOpacity
              onPress={() => handleAdjustTime(-15)}
              style={styles.scrubberBtn}>
              <AppText style={styles.scrubberBtnText}>
                {createAlarmString.minus15m}
              </AppText>
            </TouchableOpacity>

            <View style={styles.restBadge}>
              <AppText>🌙</AppText>
              <AppText style={styles.restBadgeText}>
                {createAlarmString.restCalculated}
              </AppText>
            </View>

            <TouchableOpacity
              onPress={() => handleAdjustTime(15)}
              style={styles.scrubberBtn}>
              <AppText style={styles.scrubberBtnText}>
                {createAlarmString.plus15m}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Repeat Rhythm Card */}
        <View style={styles.repeatCard}>
          <View style={styles.sectionRowBetween}>
            <AppText style={styles.cardSectionTitle}>
              {createAlarmString.repeatRhythm}
            </AppText>
            <View style={styles.activeDaysBadge}>
              <AppText style={styles.activeDaysBadgeText}>
                {createAlarmString.weekdaysActive}
              </AppText>
            </View>
          </View>

          <View style={styles.daysRow}>
            {DAYS.map((day, idx) => {
              const isActive = repeatDays.includes(idx);
              return (
                <TouchableOpacity
                  key={`day-${idx}`}
                  onPress={() => handleToggleDay(idx)}
                  style={[
                    styles.dayCircle,
                    isActive && styles.dayCircleActive,
                  ]}>
                  <AppText
                    style={[
                      styles.dayText,
                      isActive && styles.dayTextActive,
                    ]}>
                    {day}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Motivational Card */}
        <View style={styles.sectionHeaderLabelRow}>
          <AppText style={styles.sectionTitleMain}>
            {createAlarmString.motivationHeading}
          </AppText>
          <View style={styles.xpPlusBadge}>
            <AppText style={styles.xpPlusText}>
              {createAlarmString.motivationXp}
            </AppText>
          </View>
        </View>

        <View style={styles.visionBoxCard}>
          <View style={styles.visionPhotoPlaceholder}>
            <View style={styles.visionPhotoBg} />
            <View style={styles.visionTagTopLeft}>
              <AppText style={styles.visionTagText}>
                {createAlarmString.dreamFutureTag}
              </AppText>
            </View>
            <View style={styles.visionPhotoBottomRow}>
              <AppText style={styles.visionTitleText}>
                {createAlarmString.studioSanctuary}
              </AppText>
              <AppText style={styles.visionTitleText}>
                {createAlarmString.sunriseLockscreen}
              </AppText>
            </View>
          </View>

          <View style={styles.quoteBox}>
            <AppText style={styles.quoteBoxText}>
              {createAlarmString.quote}
            </AppText>
            <AppText style={styles.quoteMantraTag}>
              {createAlarmString.dailyMantra}
            </AppText>
          </View>
        </View>

        {/* Challenge Selector */}
        <View style={styles.sectionHeaderLabelRow}>
          <AppText style={styles.sectionTitleMain}>
            {createAlarmString.wakeUpChallengeHeading}
          </AppText>
          <AppText style={styles.activeDaysBadgeText}>
            {createAlarmString.mandatoryQuest}
          </AppText>
        </View>

        {/* Math Challenge */}
        <TouchableOpacity
          onPress={() => setChallengeType('math')}
          style={[
            styles.challengeCardOption,
            challengeType === 'math' && styles.challengeCardOptionSelected,
          ]}>
          <View style={styles.challengeLeftCol}>
            <View
              style={[
                styles.challengeIconCircle,
                challengeType !== 'math' &&
                  styles.challengeIconCircleInactive,
              ]}>
              <AppText>🧮</AppText>
            </View>
            <View>
              <View style={styles.challengeTitleRow}>
                <AppText style={styles.challengeTitle}>
                  {createAlarmString.challengeMath}
                </AppText>
                {challengeType === 'math' ? (
                  <View style={styles.challengeActiveBadge}>
                    <AppText style={styles.challengeActiveBadgeText}>
                      {createAlarmString.activeTag}
                    </AppText>
                  </View>
                ) : null}
              </View>
              <AppText style={styles.challengeDesc}>
                {createAlarmString.challengeMathDesc}
              </AppText>
            </View>
          </View>
          <View
            style={[
              styles.challengeRadioCircle,
              challengeType !== 'math' &&
                styles.challengeRadioCircleInactive,
            ]}>
            {challengeType === 'math' ? (
              <AppText style={styles.radioCheckmarkText}>✓</AppText>
            ) : null}
          </View>
        </TouchableOpacity>

        {/* Memory Grid */}
        <TouchableOpacity
          onPress={() => setChallengeType('memory')}
          style={[
            styles.challengeCardOption,
            challengeType === 'memory' && styles.challengeCardOptionSelected,
          ]}>
          <View style={styles.challengeLeftCol}>
            <View
              style={[
                styles.challengeIconCircle,
                challengeType !== 'memory' &&
                  styles.challengeIconCircleInactive,
              ]}>
              <AppText>🧩</AppText>
            </View>
            <View>
              <AppText style={styles.challengeTitle}>
                {createAlarmString.challengeMemory}
              </AppText>
              <AppText style={styles.challengeDesc}>
                {createAlarmString.challengeMemoryDesc}
              </AppText>
            </View>
          </View>
          <View
            style={[
              styles.challengeRadioCircle,
              challengeType !== 'memory' &&
                styles.challengeRadioCircleInactive,
            ]}>
            {challengeType === 'memory' ? (
              <AppText style={styles.radioCheckmarkText}>✓</AppText>
            ) : null}
          </View>
        </TouchableOpacity>

        {/* Pattern Match */}
        <TouchableOpacity
          onPress={() => setChallengeType('pattern')}
          style={[
            styles.challengeCardOption,
            challengeType === 'pattern' &&
              styles.challengeCardOptionSelected,
          ]}>
          <View style={styles.challengeLeftCol}>
            <View
              style={[
                styles.challengeIconCircle,
                challengeType !== 'pattern' &&
                  styles.challengeIconCircleInactive,
              ]}>
              <AppText>🏁</AppText>
            </View>
            <View>
              <AppText style={styles.challengeTitle}>
                {createAlarmString.challengePattern}
              </AppText>
              <AppText style={styles.challengeDesc}>
                {createAlarmString.challengePatternDesc}
              </AppText>
            </View>
          </View>
          <View
            style={[
              styles.challengeRadioCircle,
              challengeType !== 'pattern' &&
                styles.challengeRadioCircleInactive,
            ]}>
            {challengeType === 'pattern' ? (
              <AppText style={styles.radioCheckmarkText}>✓</AppText>
            ) : null}
          </View>
        </TouchableOpacity>

        {/* Quest Intensity */}
        <View style={styles.intensityCard}>
          <View style={styles.sectionRowBetween}>
            <AppText style={styles.cardSectionTitle}>
              {createAlarmString.questIntensity}
            </AppText>
            <AppText style={styles.xpPlusText}>
              {createAlarmString.rewardIntensity}
            </AppText>
          </View>

          <View style={styles.segmentedControl}>
            {(['easy', 'medium', 'hard'] as ChallengeDifficulty[]).map(
              diff => {
                const isSelected = difficulty === diff;
                return (
                  <TouchableOpacity
                    key={diff}
                    onPress={() => setDifficulty(diff)}
                    style={[
                      styles.segmentedBtn,
                      isSelected && styles.segmentedBtnActive,
                    ]}>
                    <AppText
                      style={[
                        styles.segmentedBtnText,
                        isSelected && styles.segmentedBtnTextActive,
                      ]}>
                      {diff === 'easy'
                        ? createAlarmString.easy
                        : diff === 'medium'
                        ? createAlarmString.medium
                        : createAlarmString.hard}
                    </AppText>
                  </TouchableOpacity>
                );
              },
            )}
          </View>
        </View>

        {/* Emergency Snooze Penalty */}
        <View style={styles.snoozeCard}>
          <View style={styles.snoozePenaltyRow}>
            <View style={styles.snoozeLeft}>
              <View style={styles.warningIconBox}>
                <AppText>⚠️</AppText>
              </View>
              <View>
                <AppText style={styles.snoozeHeaderTitle}>
                  {createAlarmString.snoozePenaltyHeader}
                </AppText>
                <AppText style={styles.snoozeTagPenalty}>
                  {createAlarmString.snoozePenaltyPill}
                </AppText>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setSnoozePenalty(!snoozePenalty)}
              style={[
                styles.snoozeToggleTrack,
                !snoozePenalty && styles.snoozeToggleTrackOff,
              ]}>
              <View
                style={[
                  styles.snoozeToggleThumb,
                  !snoozePenalty && styles.snoozeToggleThumbOff,
                ]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.streakNoticePill}>
            <AppText style={styles.streakNoticeText}>
              🛡️ {createAlarmString.streakGuaranteeNotice}
            </AppText>
          </View>
        </View>

        {/* Save Alarm Bottom Button */}
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.8}
          style={styles.saveAlarmBottomBtn}
          accessible={true}
          accessibilityLabel={createAlarmString.saveAlarmBtn}
          accessibilityRole="button">
          <AppText style={styles.saveAlarmBtnText}>
            ⏰ {createAlarmString.saveAlarmBtn}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaContainer>
  );
};

export default memo(CreateAlarmScreen);
