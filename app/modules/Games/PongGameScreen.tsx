import React, { FC, memo } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomHeader, SafeAreaContainer } from '../../components';
import CurvePongGame from '../../components/games/curve-pong/CurvePongGame';
import { gamesString } from '../../constants';
import { RootStackParamList } from '../../types';

type PongGameNavProp = NativeStackNavigationProp<RootStackParamList>;
type PongGameRouteProp = RouteProp<RootStackParamList, 'PongGameScreen'>;

const PongGameScreen: FC = () => {
  const navigation = useNavigation<PongGameNavProp>();
  const route = useRoute<PongGameRouteProp>();
  const isWakeUp = Boolean(route.params?.isWakeUpChallenge);

  return (
    <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
      {!isWakeUp && (
        <CustomHeader
          title={gamesString.pongCardTitle}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
      )}

      <CurvePongGame
        targetScore={2}
        isAlarmMode={isWakeUp}
        onExit={() => navigation.goBack()}
      />
    </SafeAreaContainer>
  );
};

export default memo(PongGameScreen);

