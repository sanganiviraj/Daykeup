import React, { FC, memo } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppText,
  CustomHeader,
  SafeAreaContainer,
} from '../../components';
import { commonString, homeScreenString, Routes } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  toggleAlarm,
  completeProtocolItem,
} from '../../redux';
import { RootStackParamList } from '../../types';
import { styles } from './HomeScreenStyles';

type HomeScreenNavProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: FC = () => {
  const navigation = useNavigation<HomeScreenNavProp>();
  const dispatch = useAppDispatch();

  const alarms = useAppSelector(state => state.alarm.alarms);
  const userStats = useAppSelector(state => state.gamification.userStats);

  const primaryAlarm = alarms[0];

  const handleToggleAlarm = () => {
    if (primaryAlarm) {
      dispatch(toggleAlarm(primaryAlarm.id));
    }
  };

  const handleCreateAlarm = () => {
    navigation.navigate(Routes.createAlarm);
  };

  const handleTriggerAlarm = () => {
    navigation.navigate(Routes.alarmRinging, {
      alarmId: primaryAlarm?.id,
    });
  };

  const handleMarkMorningGoalDone = () => {
    dispatch(completeProtocolItem('morningGoal'));
  };

  const completedProtocolsCount =
    (userStats.wakeUpCompleted ? 1 : 0) +
    (userStats.challengeCompleted ? 1 : 0) +
    (userStats.morningGoalCompleted ? 1 : 0);

  return (
    <SafeAreaContainer edges={['top', 'left', 'right']}>
      <CustomHeader
        title={commonString.appName}
        rightComponent={
          <AppText style={styles.homeTagText}>
            {homeScreenString.homeTab}
          </AppText>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Greeting Header */}
        <View style={styles.greetingSection}>
          <View>
            <AppText style={styles.greetingTitle}>
              {homeScreenString.greetingTitle}
            </AppText>
            <AppText style={styles.greetingSubtitle}>
              {homeScreenString.greetingSubtitle}
            </AppText>
          </View>
          <View style={styles.levelBadge}>
            <AppText style={styles.levelIcon}>⚡</AppText>
            <AppText style={styles.levelText}>
              {`Lvl ${userStats.level}`}
            </AppText>
          </View>
        </View>

        {/* 1. Today's Goal Card */}
        <View style={styles.goalCard}>
          <View style={styles.goalImageBackground} />
          <View style={styles.goalGradientOverlay} />
          <View style={styles.goalCardContent}>
            <View style={styles.goalBadgesRow}>
              <View style={styles.todayGoalPill}>
                <AppText style={styles.todayGoalPillText}>
                  {homeScreenString.todaysGoalBadge}
                </AppText>
              </View>
              <View style={styles.streakGoalPill}>
                <AppText style={styles.streakGoalPillText}>
                  {`🔥 ${userStats.streak} day streak`}
                </AppText>
              </View>
            </View>

            <AppText style={styles.goalQuoteText}>
              {primaryAlarm?.motivationalQuote || homeScreenString.quote}
            </AppText>

            <View style={styles.visionRoutinePill}>
              <AppText style={styles.visionRoutinePillText}>
                {homeScreenString.visionRoutine}
              </AppText>
            </View>
          </View>
        </View>

        {/* 2. Upcoming Alarm Card */}
        <View style={styles.sectionHeaderRow}>
          <AppText style={styles.sectionHeaderText}>
            {homeScreenString.upcomingAlarmHeader}
          </AppText>
          <AppText style={styles.inTimeBadge}>
            {homeScreenString.inHours}
          </AppText>
        </View>

        <View style={styles.alarmCard}>
          <View style={styles.alarmTopRow}>
            <View>
              <AppText style={styles.alarmSubTitle}>
                {primaryAlarm?.title || homeScreenString.alarmTitle}
              </AppText>
              <View style={styles.alarmTimeRow}>
                <AppText style={styles.alarmBigTime}>
                  {primaryAlarm ? `${primaryAlarm.hour}:${primaryAlarm.minute}` : homeScreenString.time}
                </AppText>
                <AppText style={styles.alarmPeriod}>
                  {primaryAlarm?.period || homeScreenString.am}
                </AppText>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleToggleAlarm}
              activeOpacity={0.8}
              style={[
                styles.toggleTrack,
                !primaryAlarm?.enabled && styles.toggleTrackOff,
              ]}
              accessible={true}
              accessibilityLabel="Toggle Alarm"
              accessibilityRole="button">
              <View
                style={[
                  styles.toggleThumb,
                  !primaryAlarm?.enabled && styles.toggleThumbOff,
                ]}>
                {primaryAlarm?.enabled ? (
                  <AppText style={styles.toggleCheckIcon}>✓</AppText>
                ) : null}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.alarmFooterRow}>
            <View style={styles.alarmTagsContainer}>
              <View style={styles.repeatPill}>
                <AppText style={styles.repeatPillText}>
                  {homeScreenString.repeatWeekdays}
                </AppText>
              </View>
              <View style={styles.challengePill}>
                <AppText style={styles.challengePillText}>
                  {homeScreenString.challengeTag}
                </AppText>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleCreateAlarm}
              style={styles.editButton}
              accessible={true}
              accessibilityLabel="Edit Alarm"
              accessibilityRole="button">
              <AppText style={styles.editButtonText}>
                {`${homeScreenString.tabAlarms} ›`}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Gamification Metrics Row */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View>
              <View style={styles.metricHeader}>
                <AppText style={styles.metricLabel}>
                  {homeScreenString.dayStreakLabel}
                </AppText>
                <AppText>🔥</AppText>
              </View>
              <AppText style={styles.metricBigValue}>
                {`🔥 ${userStats.streak}`}
              </AppText>
              <AppText style={styles.metricSub}>
                {homeScreenString.dayStreakSub}
              </AppText>
            </View>
            <View style={styles.pillsRow}>
              {Array.from({ length: 7 }).map((_, idx) => (
                <View key={`streak-${idx}`} style={styles.streakDot} />
              ))}
            </View>
          </View>

          <View style={styles.metricCard}>
            <View>
              <View style={styles.metricHeader}>
                <AppText style={styles.metricLabel}>
                  {homeScreenString.wakePointsLabel}
                </AppText>
                <AppText>🏆</AppText>
              </View>
              <AppText style={styles.metricBigValue}>
                {`🏆 ${userStats.wakePoints.toLocaleString()}`}
              </AppText>
              <AppText style={styles.metricSub}>
                {homeScreenString.wakePointsSub}
              </AppText>
            </View>
            <View style={styles.gainPill}>
              <AppText style={styles.gainPillText}>
                {homeScreenString.gainToday}
              </AppText>
            </View>
          </View>
        </View>

        {/* 4. Today's Protocol Checklist */}
        <View style={styles.sectionHeaderRow}>
          <AppText style={styles.sectionHeaderText}>
            {homeScreenString.protocolHeader}
          </AppText>
          <AppText style={styles.inTimeBadge}>
            {`${completedProtocolsCount} / 3 Done`}
          </AppText>
        </View>

        <View style={styles.protocolContainer}>
          {/* Item 1: Wake Up */}
          <View style={styles.protocolItemRow}>
            <View style={styles.protocolLeft}>
              <View style={styles.checkCircleCompleted}>
                <AppText style={styles.checkIcon}>✓</AppText>
              </View>
              <View style={styles.protocolTextCol}>
                <AppText style={styles.protocolTitle}>
                  {homeScreenString.protocolWakeTitle}
                </AppText>
                <AppText style={styles.protocolSub}>
                  {homeScreenString.protocolWakeSub}
                </AppText>
              </View>
            </View>
            <View style={styles.xpPill}>
              <AppText style={styles.xpPillText}>
                {homeScreenString.protocolWakeXp}
              </AppText>
            </View>
          </View>

          {/* Item 2: Challenge */}
          <View style={styles.protocolItemRow}>
            <View style={styles.protocolLeft}>
              <View style={styles.checkCircleCompleted}>
                <AppText style={styles.checkIcon}>✓</AppText>
              </View>
              <View style={styles.protocolTextCol}>
                <AppText style={styles.protocolTitle}>
                  {homeScreenString.protocolChallengeTitle}
                </AppText>
                <AppText style={styles.protocolSub}>
                  {homeScreenString.protocolChallengeSub}
                </AppText>
              </View>
            </View>
            <View style={styles.xpPill}>
              <AppText style={styles.xpPillText}>
                {homeScreenString.protocolChallengeXp}
              </AppText>
            </View>
          </View>

          {/* Item 3: Morning Goal */}
          <View
            style={[
              styles.protocolItemRow,
              !userStats.morningGoalCompleted && styles.protocolItemRowPending,
            ]}>
            <View style={styles.protocolLeft}>
              <View
                style={
                  userStats.morningGoalCompleted
                    ? styles.checkCircleCompleted
                    : styles.checkCirclePending
                }>
                {userStats.morningGoalCompleted ? (
                  <AppText style={styles.checkIcon}>✓</AppText>
                ) : (
                  <View style={styles.pendingDot} />
                )}
              </View>
              <View style={styles.protocolTextCol}>
                <AppText style={styles.protocolTitle}>
                  {homeScreenString.protocolGoalTitle}
                </AppText>
                <AppText style={styles.protocolSub}>
                  {homeScreenString.protocolGoalSub}
                </AppText>
              </View>
            </View>
            {userStats.morningGoalCompleted ? (
              <View style={styles.xpPill}>
                <AppText style={styles.xpPillText}>+20 XP</AppText>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleMarkMorningGoalDone}
                style={styles.markDoneBtn}
                accessible={true}
                accessibilityLabel="Mark Goal Done"
                accessibilityRole="button">
                <AppText style={styles.markDoneBtnText}>
                  {homeScreenString.protocolHeader}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 5. Quick Actions */}
        <View style={styles.sectionHeaderRow}>
          <AppText style={styles.sectionHeaderText}>
            {homeScreenString.quickActionsHeader}
          </AppText>
        </View>

        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            onPress={handleCreateAlarm}
            style={[styles.quickActionBtn, styles.quickActionPrimary]}
            accessible={true}
            accessibilityLabel="Create Alarm"
            accessibilityRole="button">
            <AppText style={styles.quickActionTextPrimary}>
              {homeScreenString.createAlarmBtn}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCreateAlarm}
            style={styles.quickActionBtn}
            accessible={true}
            accessibilityLabel="Set Goal"
            accessibilityRole="button">
            <AppText style={styles.quickActionText}>
              {homeScreenString.setGoalBtn}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.challenge)}
            style={styles.quickActionBtn}
            accessible={true}
            accessibilityLabel="Challenges"
            accessibilityRole="button">
            <AppText style={styles.quickActionTextMelon}>
              {homeScreenString.challengesBtn}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {}}
            style={styles.quickActionBtn}
            accessible={true}
            accessibilityLabel="Statistics"
            accessibilityRole="button">
            <AppText style={styles.quickActionText}>
              {homeScreenString.statisticsBtn}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Live Alarm Test Trigger */}
        <TouchableOpacity
          onPress={handleTriggerAlarm}
          style={styles.testRingBtn}
          accessible={true}
          accessibilityLabel="Test Alarm Ringing"
          accessibilityRole="button">
          <AppText style={styles.testRingBtnText}>
            🔔 Test Live Alarm Ringing & Swipe
          </AppText>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navTabItem, styles.navTabActive]}>
          <AppText style={styles.navTabIcon}>🏠</AppText>
          <AppText style={[styles.navTabLabel, styles.navTabLabelActive]}>
            {homeScreenString.tabHome}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCreateAlarm}
          style={styles.navTabItem}>
          <AppText style={styles.navTabIcon}>⏰</AppText>
          <AppText style={styles.navTabLabel}>
            {homeScreenString.tabAlarms}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate(Routes.challenge)}
          style={styles.navTabItem}>
          <AppText style={styles.navTabIcon}>🎮</AppText>
          <AppText style={styles.navTabLabel}>
            {homeScreenString.tabChallenges}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTabItem}>
          <AppText style={styles.navTabIcon}>📊</AppText>
          <AppText style={styles.navTabLabel}>
            {homeScreenString.tabStats}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTabItem}>
          <AppText style={styles.navTabIcon}>👤</AppText>
          <AppText style={styles.navTabLabel}>
            {homeScreenString.tabProfile}
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaContainer>
  );
};

export default memo(HomeScreen);
