import React, { FC, memo } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomHeader, SafeAreaContainer } from '../../components';
import ShadowDuelGame from '../../components/games/shadow-duel/ShadowDuelGame';
import { gamesString } from '../../constants';
import { RootStackParamList } from '../../types';

type DuelGameNavProp = NativeStackNavigationProp<RootStackParamList>;
type DuelGameRouteProp = RouteProp<RootStackParamList, 'DuelGameScreen'>;

const DuelGameScreen: FC = () => {
  const navigation = useNavigation<DuelGameNavProp>();
  const route = useRoute<DuelGameRouteProp>();
  const isWakeUp = Boolean(route.params?.isWakeUpChallenge);

  return (
    <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
      {!isWakeUp && (
        <CustomHeader
          title={gamesString.duelCardTitle}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
      )}

      <ShadowDuelGame
        enemyHp={70}
        isAlarmMode={isWakeUp}
        onExit={() => navigation.goBack()}
      />
    </SafeAreaContainer>
  );
};

export default memo(DuelGameScreen);

