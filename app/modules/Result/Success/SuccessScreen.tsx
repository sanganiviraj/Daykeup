import React, { FC, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, SafeAreaContainer } from '../../../components';
import { resultScreenString, Routes } from '../../../constants';
import { useAppSelector } from '../../../hooks';
import { RootStackParamList } from '../../../types';
import { styles } from './SuccessScreenStyles';

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
    <SafeAreaContainer edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.trophyCircle}>
            <AppText style={styles.trophyEmoji}>🏆</AppText>
          </View>

          <AppText style={styles.titleText}>
            {resultScreenString.congratulations}
          </AppText>

          <View style={styles.xpPillBig}>
            <AppText style={styles.xpPillBigText}>
              {`+${earnedXp} Wake Points`}
            </AppText>
          </View>

          <View style={styles.streakCard}>
            <AppText style={styles.streakText}>
              {`🔥 ${currentStreak} Day Streak`}
            </AppText>
            <AppText style={styles.levelProgressText}>
              {`Level ${userStats.level} • Rank: Ascendant`}
            </AppText>
          </View>

          <View style={styles.quoteBox}>
            <AppText style={styles.quoteText}>
              {resultScreenString.motivationalPraise}
            </AppText>
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

