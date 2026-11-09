import React, { FC, memo } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppText,
  CustomHeader,
  SafeAreaContainer,
  SwipeToWake,
} from '../../../components';
import { alarmRingingString, Routes } from '../../../constants';
import { useAppSelector } from '../../../hooks';
import { RootStackParamList } from '../../../types';
import { Colors } from '../../../theme/Colors';
import { styles } from './AlarmRingingScreenStyles';

type AlarmRingingRouteProp = RouteProp<
  RootStackParamList,
  'AlarmRingingScreen'
>;
type AlarmRingingNavProp = NativeStackNavigationProp<RootStackParamList>;

const AlarmRingingScreen: FC = () => {
  const navigation = useNavigation<AlarmRingingNavProp>();
  const route = useRoute<AlarmRingingRouteProp>();

  const alarms = useAppSelector(state => state.alarm.alarms);
  const userStats = useAppSelector(state => state.gamification.userStats);

  const alarmId = route.params?.alarmId;
  const currentAlarm = alarms.find(a => a.id === alarmId) || alarms[0];

  const handleSwipeComplete = () => {
    navigation.replace(Routes.challenge, {
      alarmId: currentAlarm?.id,
    });
  };

  return (
    <SafeAreaContainer
      edges={['top', 'left', 'right', 'bottom']}
      backgroundColor={Colors.darkBg}
      isDark={true}>
      <CustomHeader
        title={alarmRingingString.headerTitle}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        isDark={true}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View>
          {/* Ringing Indicator Pill */}
          <View style={styles.indicatorRow}>
            <View style={styles.ringingPill}>
              <AppText style={styles.ringingBell}>🔔</AppText>
              <AppText style={styles.ringingPillText}>
                {alarmRingingString.ringingBadge}
              </AppText>
            </View>
          </View>

          {/* Large Time Display */}
          <View style={styles.timeContainer}>
            <View style={styles.timeRow}>
              <AppText style={styles.timeBigText}>
                {currentAlarm
                  ? `${currentAlarm.hour}:${currentAlarm.minute}`
                  : alarmRingingString.time}
              </AppText>
              <AppText style={styles.timePeriod}>
                {currentAlarm?.period || alarmRingingString.am}
              </AppText>
            </View>

            <View style={styles.dateLevelRow}>
              <AppText style={styles.dateText}>
                {alarmRingingString.dateLevel}
              </AppText>
              <View style={styles.dotDivider} />
              <AppText style={styles.levelText}>
                {`LEVEL ${userStats.level} ASCENDANT`}
              </AppText>
            </View>
          </View>

          {/* Motivational Vision Card */}
          <View style={styles.visionCard}>
            <View style={styles.visionImageContainer}>
              <View style={styles.visionImageBackground} />
              <View style={styles.visionGradient} />

              <View style={styles.wakeCallBadge}>
                <AppText>⭐</AppText>
                <AppText style={styles.wakeCallText}>
                  {alarmRingingString.todaysWakeCall}
                </AppText>
              </View>

              <View style={styles.xpBoostBadge}>
                <AppText style={styles.xpBoostText}>
                  {alarmRingingString.xpBoost}
                </AppText>
              </View>
            </View>

            <View style={styles.visionContent}>
              <View style={styles.quoteRow}>
                <AppText style={styles.quoteIcon}>“</AppText>
                <AppText style={styles.quoteText}>
                  {currentAlarm?.motivationalQuote ||
                    alarmRingingString.quote}
                </AppText>
              </View>

              <View style={styles.soundRow}>
                <View style={styles.soundLeft}>
                  <View style={styles.musicDisc}>
                    <AppText>🎵</AppText>
                  </View>
                  <View>
                    <AppText style={styles.soundTitle}>
                      {alarmRingingString.soundTitle}
                    </AppText>
                    <AppText style={styles.soundSub}>
                      {alarmRingingString.soundSub}
                    </AppText>
                  </View>
                </View>

                <View style={styles.equalizerContainer}>
                  <View style={styles.equalizerBar} />
                  <View
                    style={[styles.equalizerBar, styles.equalizerBarAlt]}
                  />
                  <View style={styles.equalizerBar} />
                  <View
                    style={[styles.equalizerBar, styles.equalizerBarAlt]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Mental Gate Required */}
          <View style={styles.mentalGateRow}>
            <View style={styles.mentalGateLeft}>
              <View style={styles.mentalGateIconBox}>
                <AppText>🧠</AppText>
              </View>
              <View>
                <AppText style={styles.mentalGateTitle}>
                  {alarmRingingString.mentalGateTitle}
                </AppText>
                <AppText style={styles.mentalGateSub}>
                  {alarmRingingString.mentalGateSub}
                </AppText>
              </View>
            </View>

            <View style={styles.timedBadge}>
              <AppText style={styles.timedBadgeText}>
                {alarmRingingString.timedBadge}
              </AppText>
            </View>
          </View>
        </View>

        {/* Swipe To Wake Interactive Slider */}
        <SwipeToWake onSwipeComplete={handleSwipeComplete} />
      </ScrollView>
    </SafeAreaContainer>
  );
};

export default memo(AlarmRingingScreen);

