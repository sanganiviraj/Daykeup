import React, { FC, memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppText,
  CustomHeader,
  SafeAreaContainer,
  SwipeToWake,
} from '../../../components';
import { alarmRingingString, Images, Routes } from '../../../constants';
import { useAppSelector } from '../../../hooks';
import { AlarmService } from '../../../services';
import { RootStackParamList } from '../../../types';
import { Colors } from '../../../theme/Colors';
import { verticalScale } from '../../../theme/Metrics';
import { styles } from './AlarmRingingScreenStyles';

type AlarmRingingRouteProp = RouteProp<
  RootStackParamList,
  'AlarmRingingScreen'
>;
type AlarmRingingNavProp = NativeStackNavigationProp<RootStackParamList>;

const OVERLAY_GRADIENT = [
  'rgba(11, 17, 24, 0.75)',
  'rgba(11, 17, 24, 0.15)',
  'rgba(11, 17, 24, 0.55)',
  'rgba(11, 17, 24, 0.95)',
];
const OVERLAY_LOCATIONS = [0, 0.35, 0.65, 1];

const AlarmRingingScreen: FC = () => {
  const navigation = useNavigation<AlarmRingingNavProp>();
  const route = useRoute<AlarmRingingRouteProp>();
  const insets = useSafeAreaInsets();

  const alarms = useAppSelector(state => state.alarm.alarms);

  const alarmId = route.params?.alarmId;
  const currentAlarm = alarms.find(a => a.id === alarmId) || alarms[0];
  const imageSource = currentAlarm?.motivationalImage
    ? { uri: currentAlarm.motivationalImage }
    : Images.alarmDefaultBg;

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleSwipeComplete = () => {
    navigation.replace(Routes.challenge, {
      alarmId: currentAlarm?.id,
    });
  };

  return (
    <SafeAreaContainer
      edges={[]}
      backgroundColor={Colors.darkBg}
      isDark={true}>
      <ImageBackground
        source={imageSource}
        style={StyleSheet.absoluteFill}
        resizeMode="cover">
        <LinearGradient
          colors={OVERLAY_GRADIENT}
          locations={OVERLAY_LOCATIONS}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <View
        style={[
          styles.contentContainer,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + verticalScale(24),
          },
        ]}>
        <CustomHeader
          title={alarmRingingString.headerTitle}
          showBack={true}
          onBackPress={() => {
            AlarmService.stopAlarmSound();
            navigation.goBack();
          }}
          isDark={true}
        />

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
            <AppText style={styles.dateText}>{todayLabel}</AppText>
          </View>
        </View>

        <View style={styles.spacer} />

        {/* Motivational Quote */}
        <View style={styles.quoteRow}>
          <AppText style={styles.quoteText}>
            {currentAlarm?.motivationalQuote || alarmRingingString.quote}
          </AppText>
        </View>

        {/* Swipe To Wake Interactive Slider */}
        <SwipeToWake onSwipeComplete={handleSwipeComplete} />
      </View>
    </SafeAreaContainer>
  );
};

export default memo(AlarmRingingScreen);
