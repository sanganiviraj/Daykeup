import React, { FC, memo } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomHeader, SafeAreaContainer } from '../../components';
import StackTowerGame from '../../components/games/stack-tower/StackTowerGame';
import { gamesString } from '../../constants';
import { RootStackParamList } from '../../types';

type StackGameNavProp = NativeStackNavigationProp<RootStackParamList>;
type StackGameRouteProp = RouteProp<RootStackParamList, 'StackGameScreen'>;

const StackGameScreen: FC = () => {
  const navigation = useNavigation<StackGameNavProp>();
  const route = useRoute<StackGameRouteProp>();
  const isWakeUp = Boolean(route.params?.isWakeUpChallenge);

  return (
    <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
      {!isWakeUp && (
        <CustomHeader
          title={gamesString.stackCardTitle}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
      )}

      <StackTowerGame
        targetHeight={10}
        isAlarmMode={isWakeUp}
        onExit={() => navigation.goBack()}
      />
    </SafeAreaContainer>
  );
};

export default memo(StackGameScreen);

