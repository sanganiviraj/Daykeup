import React, { FC, memo, useMemo, useState } from 'react';
import { Image, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AnimatedEntrance,
  AppIcon,
  AppText,
  CustomHeader,
  SafeAreaContainer,
  WakeHeatmap,
} from '../../components';
import { AppIconName } from '../../components/app-icon/AppIcon';
import { Images, profileString } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setUserName } from '../../redux';
import { RootStackParamList } from '../../types';
import { computeStreak } from '../../utils';
import { Colors } from '../../theme/Colors';
import { STAT_ICON_SIZE, styles } from './ProfileScreenStyles';

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList>;

const CARD_GRADIENT = [
  Colors.heroGradientStart,
  Colors.heroGradientMid,
  Colors.heroGradientEnd,
];

const ProfileScreen: FC = () => {
  const navigation = useNavigation<ProfileNavProp>();
  const dispatch = useAppDispatch();
  const stats = useAppSelector(state => state.gamification.userStats);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draftName, setDraftName] = useState<string>(stats.name);

  const streak = useMemo(() => computeStreak(stats.wakeHistory), [stats.wakeHistory]);
  const totalWakeUps = Object.keys(stats.wakeHistory).length;
  const levelCap = stats.level * 100;
  const levelProgress = Math.min(stats.xp / levelCap, 1);
  const xpToNext = Math.max(levelCap - stats.xp, 0);

  const handleSaveName = () => {
    dispatch(setUserName(draftName.trim()));
    setIsEditing(false);
  };

  const statCards: ReadonlyArray<{ icon: AppIconName; value: number; label: string }> = [
    { icon: 'flame', value: streak, label: profileString.streakLabel },
    { icon: 'medal', value: Math.max(stats.bestStreak, streak), label: profileString.bestStreakLabel },
    { icon: 'trophy', value: stats.wakePoints, label: profileString.pointsLabel },
    { icon: 'sunrise', value: totalWakeUps, label: profileString.wakeUpsLabel },
  ];

  return (
    <SafeAreaContainer
      edges={['top', 'left', 'right']}
      backgroundColor={Colors.creamBackground}>
      <CustomHeader
        title={profileString.headerTitle}
        showBack={true}
        showAvatar={false}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <AnimatedEntrance>
          <LinearGradient
            colors={CARD_GRADIENT}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.profileCard}>
            <View style={styles.identityRow}>
              <View style={styles.avatar}>
                {stats.name ? (
                  <AppText style={styles.avatarInitial}>
                    {stats.name.trim().charAt(0).toUpperCase()}
                  </AppText>
                ) : (
                  <AppIcon name="user" size="lg" color={Colors.brandCream} />
                )}
              </View>

              <View style={styles.identityText}>
                {isEditing ? (
                  <TextInput
                    value={draftName}
                    onChangeText={setDraftName}
                    onSubmitEditing={handleSaveName}
                    placeholder={profileString.namePlaceholder}
                    placeholderTextColor={Colors.heroSubText}
                    style={styles.nameInput}
                    maxLength={24}
                    autoFocus={true}
                    returnKeyType="done"
                    accessibilityLabel={profileString.nameLabel}
                  />
                ) : (
                  <AppText
                    style={[styles.nameText, !stats.name && styles.nameTextEmpty]}
                    numberOfLines={1}>
                    {stats.name || profileString.namePlaceholder}
                  </AppText>
                )}
                <View style={styles.levelBadge}>
                  <AppIcon name="star" size="xs" color={Colors.brandCream} />
                  <AppText style={styles.levelBadgeText}>
                    {`${profileString.levelLabel} ${stats.level}`}
                  </AppText>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={
                  isEditing
                    ? handleSaveName
                    : () => {
                        setDraftName(stats.name);
                        setIsEditing(true);
                      }
                }
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={
                  isEditing ? profileString.saveNameAria : profileString.editNameAria
                }>
                <AppIcon
                  name={isEditing ? 'check' : 'pencil'}
                  size="sm"
                  color={Colors.heroTextCream}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.progressBlock}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${levelProgress * 100}%` }]} />
              </View>
              <AppText style={styles.progressHint}>
                {`${xpToNext} ${profileString.xpToNext}`}
              </AppText>
            </View>
          </LinearGradient>
        </AnimatedEntrance>

        <AnimatedEntrance delay={120}>
          <View style={styles.statsGrid}>
            {statCards.map(card => (
              <View key={card.label} style={styles.statCard}>
                <View style={styles.statIconBox}>
                  <AppIcon name={card.icon} size={STAT_ICON_SIZE} color={Colors.brandOrange} />
                </View>
                <View style={styles.statTextCol}>
                  <AppText style={styles.statValue}>{card.value}</AppText>
                  <AppText style={styles.statLabel} numberOfLines={1}>
                    {card.label}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </AnimatedEntrance>

        <AnimatedEntrance delay={220}>
          <LinearGradient
            colors={CARD_GRADIENT}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.activityCard}>
            <AppText style={styles.activityTitle}>{profileString.activityTitle}</AppText>
            <AppText style={styles.activitySubtitle}>{profileString.activitySubtitle}</AppText>
            <WakeHeatmap history={stats.wakeHistory} trackingSince={stats.trackingSince} />

            {totalWakeUps === 0 && (
              <View style={styles.emptyRow}>
                <Image
                  source={Images.onboardingEnergeticClock}
                  style={styles.emptyMascot}
                  resizeMode="contain"
                />
                <View style={styles.emptyTextCol}>
                  <AppText style={styles.emptyTitle}>{profileString.emptyTitle}</AppText>
                  <AppText style={styles.emptySub}>{profileString.emptySub}</AppText>
                </View>
              </View>
            )}
          </LinearGradient>
        </AnimatedEntrance>
      </ScrollView>
    </SafeAreaContainer>
  );
};

export default memo(ProfileScreen);
