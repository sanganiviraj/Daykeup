import React, { FC, memo } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomHeader, SafeAreaContainer } from '../../components';
import AirHockeyGame from '../../components/games/air-hockey/AirHockeyGame';
import { gamesString } from '../../constants';
import { RootStackParamList } from '../../types';

type HockeyGameNavProp = NativeStackNavigationProp<RootStackParamList>;
type HockeyGameRouteProp = RouteProp<RootStackParamList, 'HockeyGameScreen'>;

const HockeyGameScreen: FC = () => {
  const navigation = useNavigation<HockeyGameNavProp>();
  const route = useRoute<HockeyGameRouteProp>();
  const isWakeUp = Boolean(route.params?.isWakeUpChallenge);

  return (
    <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
      {!isWakeUp && (
        <CustomHeader
          title={gamesString.hockeyCardTitle}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
      )}

      <AirHockeyGame
        targetScore={2}
        isAlarmMode={isWakeUp}
        onExit={() => navigation.goBack()}
      />
    </SafeAreaContainer>
  );
};

export default memo(HockeyGameScreen);

