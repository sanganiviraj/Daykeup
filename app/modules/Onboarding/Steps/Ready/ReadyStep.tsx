import React, { FC, memo, useCallback } from 'react';
import { Image, Switch, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  AnimatedEntrance,
  AppIcon,
  AppText,
  FloatingView,
} from '../../../../components';
import {
  challengeIcons,
  challengeNames,
  Images,
  onboardingDifficultyNames,
  onboardingString,
} from '../../../../constants';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { updateOnboarding } from '../../../../redux';
import { formatRepeatDays, formatTime12, minutesToTime12 } from '../../../../utils';
import { Colors } from '../../../../theme/Colors';
import { moderateScale } from '../../../../theme/Metrics';
import { commonStyles } from '../../OnboardingCommonStyles';
import { HERO_GRADIENT, INTENTION_GRADIENT, GRADIENT_END, GRADIENT_START, styles } from './ReadyStepStyles';
import SummaryRow from './SummaryRow';

const ReadyStep: FC = () => {
  const dispatch = useAppDispatch();
  const { wakeMinutes, repeatDays, mission, difficulty, smartNotifications } = useAppSelector(
    state => state.onboarding,
  );

  const handleNotificationsChange = useCallback(
    (value: boolean) => {
      dispatch(updateOnboarding({ smartNotifications: value }));
    },
    [dispatch],
  );

  return (
    <View style={commonStyles.stepContainer} testID="onboarding-step-ready">
      <AnimatedEntrance>
        <LinearGradient colors={HERO_GRADIENT} style={styles.hero}>
          <FloatingView amplitude={7} duration={1700} style={styles.heroCardWrap}>
            <View style={styles.heroImageCard}>
              <Image
                source={Images.onboardingHappyClock}
                style={styles.heroImage}
                resizeMode="contain"
                accessibilityLabel={onboardingString.readyTitle}
              />
              <View style={styles.readyTag}>
                <AppIcon name="flame" size={moderateScale(13)} color={Colors.primary} />
                <AppText style={styles.readyTagText}>{onboardingString.readyTag}</AppText>
              </View>
            </View>
          </FloatingView>
          <View style={commonStyles.titleBlock}>
            <AppText style={commonStyles.title} accessibilityRole="header">
              {onboardingString.readyTitle}
            </AppText>
            <AppText
              style={commonStyles.subtitle}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}>
              {onboardingString.readySubtitle}
            </AppText>
          </View>
        </LinearGradient>
      </AnimatedEntrance>

      <AnimatedEntrance delay={140}>
        <View style={styles.summaryCard}>
          <View style={commonStyles.sectionHeader}>
            <View style={styles.summaryHeading}>
              <AppIcon name="slidersHorizontal" size={moderateScale(18)} color={Colors.primary} />
              <AppText style={commonStyles.sectionLabel}>{onboardingString.summaryTitle}</AppText>
            </View>
            <View style={styles.activePill}>
              <AppText style={styles.activePillText}>{onboardingString.summaryActive}</AppText>
            </View>
          </View>
          <SummaryRow
            icon="alarmClock"
            tone="warm"
            label={onboardingString.summaryAlarmLabel}
            value={formatTime12(minutesToTime12(wakeMinutes))}
            tag={formatRepeatDays(repeatDays)}
            delay={260}
          />
          <SummaryRow
            icon={challengeIcons[mission]}
            tone="purple"
            label={onboardingString.summaryMissionLabel}
            value={challengeNames[mission]}
            tag={onboardingDifficultyNames[difficulty]}
            delay={360}
          />
          <SummaryRow
            icon="medal"
            tone="gold"
            label={onboardingString.summaryRewardLabel}
            value={onboardingString.summaryRewardValue}
            tag={onboardingString.summaryRewardTag}
            delay={460}
          />
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={300}>
        <LinearGradient
          colors={INTENTION_GRADIENT}
          start={GRADIENT_START}
          end={GRADIENT_END}
          style={styles.intention}>
          <AppIcon
            name="quote"
            size={moderateScale(72)}
            color={Colors.brandBrown}
            style={styles.intentionQuoteMark}
          />
          <View style={styles.intentionLabelRow}>
            <AppIcon name="sunset" size={moderateScale(16)} color={Colors.brandBrown} />
            <AppText style={styles.intentionLabel}>{onboardingString.intentionLabel}</AppText>
          </View>
          <AppText style={styles.intentionQuote}>{onboardingString.intentionQuote}</AppText>
        </LinearGradient>
      </AnimatedEntrance>

      <AnimatedEntrance delay={400}>
        <View style={styles.notificationCard}>
          <View style={styles.notificationIcon}>
            <AppIcon name="bellRing" size={moderateScale(18)} color={Colors.primary} />
          </View>
          <View style={styles.notificationCopy}>
            <AppText style={commonStyles.sectionLabel}>{onboardingString.notificationsTitle}</AppText>
            <AppText style={styles.notificationSub}>{onboardingString.notificationsSub}</AppText>
          </View>
          <Switch
            value={smartNotifications}
            onValueChange={handleNotificationsChange}
            trackColor={{ false: Colors.grayLight, true: Colors.primaryContainer }}
            thumbColor={Colors.white}
            ios_backgroundColor={Colors.grayLight}
            accessibilityLabel={onboardingString.notificationsTitle}
            testID="onboarding-notifications-switch"
          />
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={480}>
        <AppText style={styles.footnote}>{onboardingString.readyFootnote}</AppText>
      </AnimatedEntrance>
    </View>
  );
};

export default memo(ReadyStep);
