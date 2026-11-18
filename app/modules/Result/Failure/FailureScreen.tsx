import React, { FC, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppIcon, AppText, SafeAreaContainer } from '../../../components';
import { resultScreenString, Routes } from '../../../constants';
import { RootStackParamList } from '../../../types';
import { Colors } from '../../../theme/Colors';
import { HERO_ICON_SIZE, styles } from './FailureScreenStyles';

type FailureNavProp = NativeStackNavigationProp<RootStackParamList>;
type FailureRouteProp = RouteProp<RootStackParamList, 'FailureScreen'>;

const FailureScreen: FC = () => {
  const navigation = useNavigation<FailureNavProp>();
  const route = useRoute<FailureRouteProp>();

  const handleRetry = () => {
    navigation.replace(Routes.alarmRinging, { alarmId: route.params?.alarmId });
  };

  return (
    <SafeAreaContainer
      edges={['top', 'bottom', 'left', 'right']}
      backgroundColor={Colors.creamBackground}>
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.iconCircle}>
            <AppIcon
              name="alarmClock"
              size={HERO_ICON_SIZE}
              strokeWidth={1.75}
              color={Colors.error}
            />
          </View>

          <AppText style={styles.titleText}>
            {resultScreenString.failedTitle}
          </AppText>

          <AppText style={styles.descText}>
            {resultScreenString.failedDesc}
          </AppText>
        </View>

        <TouchableOpacity
          onPress={handleRetry}
          activeOpacity={0.8}
          style={styles.retryBtn}
          accessible={true}
          accessibilityLabel={resultScreenString.retryChallenge}
          accessibilityRole="button">
          <AppIcon name="rotateCcw" size="sm" color={Colors.white} />
          <AppText style={styles.retryBtnText}>
            {resultScreenString.retryChallenge}
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaContainer>
  );
};

export default memo(FailureScreen);
