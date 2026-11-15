import React, { FC, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppIcon, AppText, SafeAreaContainer } from '../../../components';
import { resultScreenString, Routes } from '../../../constants';
import { useAppSelector } from '../../../hooks';
import { RootStackParamList } from '../../../types';
import { Colors } from '../../../theme/Colors';
import { HERO_ICON_SIZE, styles } from './SuccessScreenStyles';

type SuccessRouteProp = RouteProp<RootStackParamList, 'SuccessScreen'>;
type SuccessNavProp = NativeStackNavigationProp<RootStackParamList>;

const SuccessScreen: FC = () => {
  const navigation = useNavigation<SuccessNavProp>();
  const route = useRoute<SuccessRouteProp>();
  const userStats = useAppSelector(state => state.gamification.userStats);

  const earnedXp = route.params?.earnedXp || 25;
  const currentStreak = route.params?.streak || userStats.streak;

  const handleContinue = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: Routes.home }],
    });
  };

  return (
    <SafeAreaContainer
      edges={['top', 'bottom', 'left', 'right']}
      backgroundColor={Colors.creamBackground}>
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.iconCircle}>
            <AppIcon
              name="sun"
              size={HERO_ICON_SIZE}
              strokeWidth={1.75}
              color={Colors.brandOrange}
            />
          </View>

          <AppText style={styles.titleText}>
            {resultScreenString.congratulations}
          </AppText>
          <AppText style={styles.subText}>
            {resultScreenString.successSub}
          </AppText>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <View style={styles.statValueRow}>
                <AppIcon name="trophy" size="sm" color={Colors.brandOrange} />
                <AppText style={styles.statValue}>{`+${earnedXp}`}</AppText>
              </View>
              <AppText style={styles.statLabel}>
                {resultScreenString.pointsLabel}
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <View style={styles.statValueRow}>
                <AppIcon name="flame" size="sm" color={Colors.brandOrange} />
                <AppText style={styles.statValue}>{currentStreak}</AppText>
              </View>
              <AppText style={styles.statLabel}>
                {resultScreenString.streakLabel}
              </AppText>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.8}
          style={styles.continueBtn}
          accessible={true}
          accessibilityLabel={resultScreenString.continueToDashboard}
          accessibilityRole="button">
          <AppText style={styles.continueBtnText}>
            {resultScreenString.continueToDashboard}
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaContainer>
  );
};

export default memo(SuccessScreen);
