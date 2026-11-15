import React, { FC, memo } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomHeader, SafeAreaContainer } from '../../components';
import KnifeThrowerGame from '../../components/games/knife-thrower/KnifeThrowerGame';
import { gamesString } from '../../constants';
import { RootStackParamList } from '../../types';

type KnifeGameNavProp = NativeStackNavigationProp<RootStackParamList>;
type KnifeGameRouteProp = RouteProp<RootStackParamList, 'KnifeGameScreen'>;

const KnifeGameScreen: FC = () => {
  const navigation = useNavigation<KnifeGameNavProp>();
  const route = useRoute<KnifeGameRouteProp>();
  const isWakeUp = Boolean(route.params?.isWakeUpChallenge);

  return (
    <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
      {!isWakeUp && (
        <CustomHeader
          title={gamesString.knifeCardTitle}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
      )}

      <KnifeThrowerGame
        totalKnives={7}
        initialKnivesCount={1}
        isAlarmMode={isWakeUp}
        onExit={() => navigation.goBack()}
      />
    </SafeAreaContainer>
  );
};

export default memo(KnifeGameScreen);

