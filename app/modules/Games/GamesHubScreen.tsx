import React, { FC, memo } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppIcon,
  AppText,
  CustomHeader,
  SafeAreaContainer,
} from '../../components';
import { challengeIcons, gamesString, Routes } from '../../constants';
import { Colors } from '../../theme/Colors';
import { RootStackParamList } from '../../types';
import { styles } from './GamesHubScreenStyles';

type GamesHubNavProp = NativeStackNavigationProp<RootStackParamList>;

const GAMES = [
  {
    key: 'knife',
    route: Routes.knifeGame,
    icon: challengeIcons.knife,
    title: gamesString.knifeCardTitle,
    desc: gamesString.knifeCardDesc,
  },
  {
    key: 'hockey',
    route: Routes.hockeyGame,
    icon: challengeIcons.hockey,
    title: gamesString.hockeyCardTitle,
    desc: gamesString.hockeyCardDesc,
  },
  {
    key: 'stack',
    route: Routes.stackGame,
    icon: challengeIcons.stack,
    title: gamesString.stackCardTitle,
    desc: gamesString.stackCardDesc,
  },
  {
    key: 'pong',
    route: Routes.pongGame,
    icon: challengeIcons.pong,
    title: gamesString.pongCardTitle,
    desc: gamesString.pongCardDesc,
  },
] as const;

const GamesHubScreen: FC = () => {
  const navigation = useNavigation<GamesHubNavProp>();

  return (
    <SafeAreaContainer
      edges={['top', 'left', 'right']}
      backgroundColor={Colors.creamBackground}>
      <CustomHeader
        title={gamesString.hubTitle}
        showBack={true}
        showAvatar={false}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AppText style={styles.subtitle}>{gamesString.hubSubtitle}</AppText>

        <View style={styles.list}>
          {GAMES.map((game, index) => (
            <TouchableOpacity
              key={game.key}
              style={[styles.gameRow, index > 0 && styles.gameRowDivider]}
              onPress={() => navigation.navigate(game.route)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={game.title}
              accessibilityRole="button">
              <View style={styles.iconBox}>
                <AppIcon name={game.icon} size="lg" color={Colors.brandOrange} />
              </View>
              <View style={styles.textCol}>
                <AppText style={styles.gameTitle}>{game.title}</AppText>
                <AppText style={styles.gameDesc}>{game.desc}</AppText>
              </View>
              <AppIcon name="chevronRight" size="md" color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
};

export default memo(GamesHubScreen);
