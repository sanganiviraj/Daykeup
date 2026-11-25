import React, { FC, memo } from 'react';
import { Image, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  AnimatedEntrance,
  AppIcon,
  AppText,
  FloatingView,
  PulseDot,
} from '../../../../components';
import { Images, onboardingFeatures, onboardingString } from '../../../../constants';
import { Colors } from '../../../../theme/Colors';
import { moderateScale } from '../../../../theme/Metrics';
import { commonStyles } from '../../OnboardingCommonStyles';
import { HERO_GRADIENT, STAGE_GRADIENT, styles } from './WelcomeStepStyles';

const WelcomeStep: FC = () => {
  return (
    <View style={commonStyles.stepContainer} testID="onboarding-step-welcome">
      <AnimatedEntrance>
        <LinearGradient colors={HERO_GRADIENT} style={styles.heroCard}>
          <LinearGradient colors={STAGE_GRADIENT} style={styles.stage}>
            <View style={styles.glowAmber} />
            <View style={styles.glowPurple} />
            <FloatingView amplitude={8} duration={2000} style={styles.mascotWrap}>
              <Image
                source={Images.onboardingSleepyClock}
                style={styles.mascot}
                resizeMode="contain"
                accessibilityLabel={onboardingString.welcomeMascotAria}
              />
            </FloatingView>
            <View style={styles.tag}>
              <PulseDot />
              <AppText style={styles.tagText}>{onboardingString.welcomeTag}</AppText>
            </View>
          </LinearGradient>

          <View style={styles.statStrip}>
            <AppIcon name="star" size={moderateScale(13)} color={Colors.primary} />
            <AppText style={styles.statText}>
              <AppText style={styles.statHighlight}>{onboardingString.welcomeStatHighlight}</AppText>
              {onboardingString.welcomeStatText}
            </AppText>
          </View>
        </LinearGradient>
      </AnimatedEntrance>

      <AnimatedEntrance delay={140} style={commonStyles.titleBlock}>
        <AppText
          style={commonStyles.title}
          accessibilityRole="header"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}>
          {onboardingString.welcomeTitle}
        </AppText>
        <AppText style={commonStyles.subtitle}>{onboardingString.welcomeSubtitle}</AppText>
      </AnimatedEntrance>

      <View style={styles.featureRow}>
        {onboardingFeatures.map((feature, index) => (
          <AnimatedEntrance
            key={feature.title}
            delay={260 + index * 100}
            style={styles.featureItem}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <AppIcon name={feature.icon} size={moderateScale(16)} color={Colors.primary} />
              </View>
              <AppText style={styles.featureTitle} numberOfLines={1}>
                {feature.title}
              </AppText>
              <AppText style={styles.featureSub} numberOfLines={1}>
                {feature.subtitle}
              </AppText>
            </View>
          </AnimatedEntrance>
        ))}
      </View>
    </View>
  );
};

export default memo(WelcomeStep);
