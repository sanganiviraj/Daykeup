import React, { FC, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, SafeAreaContainer } from '../../../components';
import { resultScreenString, Routes } from '../../../constants';
import { RootStackParamList } from '../../../types';
import { styles } from './FailureScreenStyles';

type FailureNavProp = NativeStackNavigationProp<RootStackParamList>;

const FailureScreen: FC = () => {
  const navigation = useNavigation<FailureNavProp>();

  const handleRetry = () => {
    navigation.replace(Routes.alarmRinging);
  };

  return (
    <SafeAreaContainer edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.bellCircle}>
            <AppText style={styles.bellEmoji}>⏰</AppText>
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
          <AppText style={styles.retryBtnText}>
            🔔 {resultScreenString.retryChallenge}
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaContainer>
  );
};

export default memo(FailureScreen);

