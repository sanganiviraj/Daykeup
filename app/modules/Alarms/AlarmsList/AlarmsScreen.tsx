import React, { FC, memo } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AlarmCard,
  AppIcon,
  AppText,
  BottomNavigation,
  CustomHeader,
  SafeAreaContainer,
} from '../../../components';
import {
  alarmListScreenString,
  commonString,
  Routes,
} from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { toggleAlarm } from '../../../redux';
import { AlarmService } from '../../../services';
import { RootStackParamList } from '../../../types';
import { Colors } from '../../../theme/Colors';
import { EMPTY_ICON_SIZE, styles } from './AlarmsScreenStyles';

type AlarmsNavProp = NativeStackNavigationProp<RootStackParamList>;

const AlarmsScreen: FC = () => {
  const navigation = useNavigation<AlarmsNavProp>();
  const dispatch = useAppDispatch();
  const alarms = useAppSelector(state => state.alarm.alarms);

  const activeCount = alarms.filter(a => a.enabled).length;

  const handleCreateAlarm = () => {
    navigation.navigate(Routes.createAlarm);
  };

  const handleEditAlarm = (alarmId: string) => {
    navigation.navigate(Routes.createAlarm, { alarmId });
  };

  const handleToggle = (alarmId: string) => {
    const target = alarms.find(a => a.id === alarmId);
    if (target) {
      if (target.enabled) {
        AlarmService.cancel(alarmId);
      } else {
        AlarmService.schedule({ ...target, enabled: true });
      }
    }
    dispatch(toggleAlarm(alarmId));
    const updatedAlarms = alarms.map(a =>
      a.id === alarmId
        ? { ...a, enabled: !a.enabled, updatedAt: new Date().toISOString() }
        : a,
    );
    AlarmService.saveAllAlarms(updatedAlarms);
  };

  return (
    <SafeAreaContainer
      edges={['top', 'left', 'right']}
      backgroundColor={Colors.creamBackground}>
      <CustomHeader
        title={commonString.appName}
        showBack={true}
        showAvatar={false}
        onBackPress={() => navigation.navigate(Routes.home)}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.titleHeaderRow}>
          <AppText style={styles.screenTitle}>
            {alarmListScreenString.headerTitle}
          </AppText>
          {alarms.length > 0 ? (
            <AppText style={styles.activeAlarmsText}>
              {activeCount > 0
                ? `${activeCount} ${alarmListScreenString.activeAlarmsCount}`
                : alarmListScreenString.noActiveAlarms}
            </AppText>
          ) : null}
        </View>

        {alarms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <AppIcon
                name="alarmClock"
                size={EMPTY_ICON_SIZE}
                strokeWidth={1.75}
                color={Colors.brandOrange}
              />
            </View>
            <AppText style={styles.emptyTitle}>
              {alarmListScreenString.emptyAlarmsTitle}
            </AppText>
            <AppText style={styles.emptySub}>
              {alarmListScreenString.emptyAlarmsSub}
            </AppText>
          </View>
        ) : (
          alarms.map(alarm => (
            <AlarmCard
              key={alarm.id}
              alarm={alarm}
              onPress={() => handleEditAlarm(alarm.id)}
              onToggle={() => handleToggle(alarm.id)}
            />
          ))
        )}
      </ScrollView>

      <BottomNavigation
        currentTab="alarms"
        onTabPress={tab => {
          if (tab === 'main') {
            navigation.navigate(Routes.home, { initialTab: 'main' });
          }
        }}
        onAddPress={handleCreateAlarm}
      />
    </SafeAreaContainer>
  );
};

export default memo(AlarmsScreen);
