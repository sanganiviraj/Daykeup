import React, { FC, memo, useCallback } from 'react';
import { TextInput, View } from 'react-native';
import {
  AnimatedEntrance,
  AppIcon,
  AppText,
  FloatingView,
  SelectableCard,
  SelectionCheck,
} from '../../../../components';
import {
  onboardingAgeOptions,
  onboardingString,
  onboardingWakeStyleOptions,
} from '../../../../constants';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { selectWakeStyle, updateOnboarding } from '../../../../redux';
import { AgeBracket, WakeStyle } from '../../../../types';
import { Colors } from '../../../../theme/Colors';
import { moderateScale } from '../../../../theme/Metrics';
import { commonStyles } from '../../OnboardingCommonStyles';
import { styles } from './RhythmStepStyles';

const NAME_MAX_LENGTH = 20;

const RhythmStep: FC = () => {
  const dispatch = useAppDispatch();
  const { name, ageBracket, wakeStyle } = useAppSelector(state => state.onboarding);

  const handleNameChange = useCallback(
    (value: string) => dispatch(updateOnboarding({ name: value })),
    [dispatch],
  );
  const handleAgePress = useCallback(
    (key: AgeBracket) => dispatch(updateOnboarding({ ageBracket: key })),
    [dispatch],
  );
  const handleWakeStylePress = useCallback(
    (key: WakeStyle) => dispatch(selectWakeStyle(key)),
    [dispatch],
  );

  return (
    <View style={commonStyles.stepContainer} testID="onboarding-step-rhythm">
      <AnimatedEntrance style={commonStyles.titleBlock}>
        <FloatingView amplitude={4} duration={1600}>
          <View style={styles.heroBadge}>
            <View style={styles.heroBadgeInner}>
              <AppIcon name="moon" size={moderateScale(26)} color={Colors.white} />
            </View>
            <View style={styles.heroBadgeSpark}>
              <AppIcon name="sparkles" size={moderateScale(12)} color={Colors.primary} />
            </View>
          </View>
        </FloatingView>
        <AppText style={commonStyles.title} accessibilityRole="header">
          {onboardingString.rhythmTitle}
        </AppText>
        <AppText
          style={commonStyles.subtitle}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}>
          {onboardingString.rhythmSubtitle}
        </AppText>
      </AnimatedEntrance>

      <AnimatedEntrance delay={120} style={styles.block}>
        <View style={commonStyles.sectionHeader}>
          <AppText style={commonStyles.sectionLabel}>{onboardingString.nameLabel}</AppText>
          <AppText style={styles.optional}>{onboardingString.nameOptional}</AppText>
        </View>
        <View style={styles.inputWrap}>
          <AppIcon name="user" size={moderateScale(18)} color={Colors.textMuted} />
          <TextInput
            value={name}
            onChangeText={handleNameChange}
            placeholder={onboardingString.namePlaceholder}
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            maxLength={NAME_MAX_LENGTH}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            accessibilityLabel={onboardingString.nameLabel}
            testID="onboarding-name-input"
          />
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={220} style={styles.block}>
        <AppText style={commonStyles.sectionLabel}>{onboardingString.ageLabel}</AppText>
        <View style={styles.ageRow} accessibilityRole="radiogroup">
          {onboardingAgeOptions.map(option => {
            const selected = option.key === ageBracket;
            return (
              <SelectableCard
                key={option.key}
                selected={selected}
                onPress={() => handleAgePress(option.key)}
                accessibilityLabel={option.label}
                style={styles.agePill}
                contentStyle={styles.agePillContent}
                selectedBackgroundColor={Colors.primaryContainer}
                unselectedBackgroundColor={Colors.white}
                testID={`onboarding-age-${option.key}`}>
                <AppText style={[styles.ageText, selected && styles.ageTextSelected]}>
                  {option.label}
                </AppText>
              </SelectableCard>
            );
          })}
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={320} style={styles.block}>
        <View style={commonStyles.sectionHeader}>
          <AppText style={commonStyles.sectionLabel}>{onboardingString.wakeStyleLabel}</AppText>
          <AppText style={commonStyles.sectionHint}>{onboardingString.wakeStyleHint}</AppText>
        </View>
        <View style={styles.wakeList} accessibilityRole="radiogroup">
          {onboardingWakeStyleOptions.map(option => {
            const selected = option.key === wakeStyle;
            return (
              <SelectableCard
                key={option.key}
                selected={selected}
                onPress={() => handleWakeStylePress(option.key)}
                accessibilityLabel={option.title}
                style={styles.wakeCard}
                contentStyle={styles.wakeCardContent}
                testID={`onboarding-wake-${option.key}`}>
                <View style={[styles.wakeIcon, selected && styles.wakeIconSelected]}>
                  <AppIcon
                    name={option.icon}
                    size={moderateScale(20)}
                    color={selected ? Colors.white : Colors.brandPurple}
                  />
                </View>
                <View style={styles.wakeCopy}>
                  <AppText
                    style={[styles.wakeTitle, selected && styles.wakeTitleSelected]}
                    numberOfLines={1}>
                    {option.title}
                  </AppText>
                  <AppText style={styles.wakeSub} numberOfLines={1}>
                    {option.subtitle}
                  </AppText>
                </View>
                <SelectionCheck selected={selected} />
              </SelectableCard>
            );
          })}
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={420}>
        <View style={styles.insight}>
          <View style={styles.insightIcon}>
            <AppIcon name="brain" size={moderateScale(16)} color={Colors.brandBrown} />
          </View>
          <AppText style={styles.insightText}>{onboardingString.rhythmInsight}</AppText>
        </View>
      </AnimatedEntrance>
    </View>
  );
};

export default memo(RhythmStep);
