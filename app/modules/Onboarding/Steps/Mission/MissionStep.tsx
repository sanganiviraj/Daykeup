import React, { FC, memo, useCallback } from 'react';
import { Image, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  AnimatedEntrance,
  AppIcon,
  AppText,
  FloatingView,
  InfoPill,
  SegmentedControl,
  SelectableCard,
  SelectionCheck,
} from '../../../../components';
import {
  challengeIcons,
  challengeNames,
  Images,
  onboardingDifficultyHints,
  onboardingDifficultyLabels,
  onboardingDifficultyOrder,
  onboardingMissionOptions,
  onboardingString,
} from '../../../../constants';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { updateOnboarding } from '../../../../redux';
import { OnboardingMission } from '../../../../types';
import { Colors } from '../../../../theme/Colors';
import { moderateScale } from '../../../../theme/Metrics';
import { commonStyles } from '../../OnboardingCommonStyles';
import { BANNER_GRADIENT, GRADIENT_END, GRADIENT_START, styles } from './MissionStepStyles';

// Alternate the warm / purple accents so the 2x2 grid feels lively.
const WARM_MISSIONS: ReadonlyArray<OnboardingMission> = ['math', 'hockey', 'stack'];

const MissionStep: FC = () => {
  const dispatch = useAppDispatch();
  const { mission, difficulty } = useAppSelector(state => state.onboarding);

  const handleMissionPress = useCallback(
    (key: OnboardingMission) => dispatch(updateOnboarding({ mission: key })),
    [dispatch],
  );
  const handleDifficultyChange = useCallback(
    (index: number) => dispatch(updateOnboarding({ difficulty: onboardingDifficultyOrder[index] })),
    [dispatch],
  );

  return (
    <View style={commonStyles.stepContainer} testID="onboarding-step-mission">
      <AnimatedEntrance>
        <LinearGradient
          colors={BANNER_GRADIENT}
          start={GRADIENT_START}
          end={GRADIENT_END}
          style={styles.banner}>
          <View style={styles.bannerCopy}>
            <InfoPill text={onboardingString.missionBannerBadge} icon="zap" tone="white" />
            <AppText style={styles.bannerTitle}>{onboardingString.missionBannerTitle}</AppText>
            <AppText style={styles.bannerSub}>{onboardingString.missionBannerSub}</AppText>
          </View>
          <FloatingView amplitude={6} duration={1500} style={styles.bannerMascotWrap}>
            <Image
              source={Images.onboardingEnergeticClock}
              style={styles.bannerMascot}
              resizeMode="contain"
              accessibilityLabel={onboardingString.missionBannerTitle}
            />
          </FloatingView>
        </LinearGradient>
      </AnimatedEntrance>

      <AnimatedEntrance delay={120} style={styles.titleBlock}>
        <AppText
          style={styles.title}
          accessibilityRole="header"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}>
          {onboardingString.missionTitle}
        </AppText>
        <AppText style={styles.subtitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {onboardingString.missionSubtitle}
        </AppText>
      </AnimatedEntrance>

      <View style={styles.grid} accessibilityRole="radiogroup">
        {onboardingMissionOptions.map((option, index) => {
          const selected = option.key === mission;
          const isWarm = WARM_MISSIONS.includes(option.key);
          return (
            <AnimatedEntrance
              key={option.key}
              delay={220 + index * 90}
              style={styles.gridItem}>
              <SelectableCard
                selected={selected}
                onPress={() => handleMissionPress(option.key)}
                accessibilityLabel={challengeNames[option.key]}
                style={styles.card}
                contentStyle={styles.cardContent}
                testID={`onboarding-mission-${option.key}`}>
                <SelectionCheck selected={selected} style={styles.check} />
                <View style={[styles.iconBox, isWarm ? styles.iconWarm : styles.iconPurple]}>
                  <AppIcon
                    name={challengeIcons[option.key]}
                    size={moderateScale(24)}
                    color={isWarm ? Colors.primary : Colors.brandPurple}
                  />
                </View>
                <View style={styles.cardCopy}>
                  <AppText style={styles.cardTitle} numberOfLines={1}>
                    {challengeNames[option.key]}
                  </AppText>
                  <AppText style={styles.cardSample} numberOfLines={1}>
                    {option.sample}
                  </AppText>
                  <View style={[styles.tag, isWarm ? styles.tagWarm : styles.tagPurple]}>
                    <AppText
                      style={[styles.tagText, isWarm ? styles.tagTextWarm : styles.tagTextPurple]}>
                      {option.tag}
                    </AppText>
                  </View>
                </View>
              </SelectableCard>
            </AnimatedEntrance>
          );
        })}
      </View>

      <AnimatedEntrance delay={600}>
        <View style={styles.intensityCard}>
          <View style={commonStyles.sectionHeader}>
            <View style={styles.intensityLabelRow}>
              <AppIcon name="slidersHorizontal" size={moderateScale(18)} color={Colors.primary} />
              <AppText style={commonStyles.sectionLabel}>{onboardingString.intensityLabel}</AppText>
            </View>
            <AppText style={styles.intensityHint}>{onboardingDifficultyHints[difficulty]}</AppText>
          </View>
          <SegmentedControl
            options={onboardingDifficultyLabels}
            selectedIndex={onboardingDifficultyOrder.indexOf(difficulty)}
            onChange={handleDifficultyChange}
            testID="onboarding-difficulty"
          />
        </View>
      </AnimatedEntrance>
    </View>
  );
};

export default memo(MissionStep);
