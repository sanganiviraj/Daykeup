import React, { FC, memo } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomHeader, SafeAreaContainer } from '../../components';
import MonsterTruckGame from '../../components/games/monster-truck/MonsterTruckGame';
import { gamesString } from '../../constants';
import { RootStackParamList } from '../../types';

type TruckGameNavProp = NativeStackNavigationProp<RootStackParamList>;
type TruckGameRouteProp = RouteProp<RootStackParamList, 'TruckGameScreen'>;

const TruckGameScreen: FC = () => {
  const navigation = useNavigation<TruckGameNavProp>();
  const route = useRoute<TruckGameRouteProp>();
  const isWakeUp = Boolean(route.params?.isWakeUpChallenge);

  return (
    <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
      {!isWakeUp && (
        <CustomHeader
          title={gamesString.truckCardTitle}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
      )}

      <MonsterTruckGame
        targetDistance={120}
        isAlarmMode={isWakeUp}
        onExit={() => navigation.goBack()}
      />
    </SafeAreaContainer>
  );
};

export default memo(TruckGameScreen);

