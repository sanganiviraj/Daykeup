import React, { FC, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from '../app-text/AppText';
import AppIcon from '../app-icon/AppIcon';
import { Colors } from '../../theme/Colors';
import { homeScreenString } from '../../constants';
import { styles } from './BottomNavigationStyle';

export type BottomTabType = 'main' | 'alarms';

interface BottomNavigationProps {
  currentTab: BottomTabType;
  onTabPress: (tab: BottomTabType) => void;
  onAddPress: () => void;
}

const BottomNavigation: FC<BottomNavigationProps> = ({
  currentTab,
  onTabPress,
  onAddPress,
}) => {
  const isMain = currentTab === 'main';
  const isAlarms = currentTab === 'alarms';

  return (
    <View style={styles.container}>
      {/* Floating Pill Dock */}
      <View style={styles.dockPill}>
        {/* Main Tab */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            isMain ? styles.activeTabButton : styles.inactiveTabButton,
          ]}
          onPress={() => onTabPress('main')}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel={homeScreenString.mainTab}
          accessibilityRole="tab">
          <AppIcon
            name="house"
            size="md"
            color={isMain ? Colors.brandOrange : Colors.navInactive}
          />
          <AppText
            style={[
              styles.tabLabel,
              isMain ? styles.activeTabLabel : styles.inactiveTabLabel,
            ]}>
            {homeScreenString.mainTab}
          </AppText>
        </TouchableOpacity>

        {/* Alarms Tab */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            isAlarms ? styles.activeTabButton : styles.inactiveTabButton,
          ]}
          onPress={() => onTabPress('alarms')}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel={homeScreenString.alarmsTab}
          accessibilityRole="tab">
          <AppIcon
            name="alarmClock"
            size="md"
            color={isAlarms ? Colors.brandOrange : Colors.navInactive}
          />
          <AppText
            style={[
              styles.tabLabel,
              isAlarms ? styles.activeTabLabel : styles.inactiveTabLabel,
            ]}>
            {homeScreenString.alarmsTab}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Floating Plus Action Button */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        onPress={onAddPress}
        activeOpacity={0.85}
        accessible={true}
        accessibilityLabel={homeScreenString.createAlarmBtn}
        accessibilityRole="button">
        <AppIcon name="plus" size="xl" strokeWidth={2.5} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default memo(BottomNavigation);

