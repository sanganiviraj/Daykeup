import React, { FC, memo } from 'react';
import { View } from 'react-native';
import { AnimatedEntrance, AppIcon, AppText } from '../../../../components';
import type { AppIconName } from '../../../../components/app-icon/AppIcon';
import { Colors } from '../../../../theme/Colors';
import { moderateScale } from '../../../../theme/Metrics';
import { styles } from './SummaryRowStyles';

type SummaryTone = 'warm' | 'purple' | 'gold';

interface SummaryRowProps {
  icon: AppIconName;
  tone: SummaryTone;
  label: string;
  value: string;
  tag: string;
  delay?: number;
}

const toneConfig = {
  warm: {
    icon: styles.iconWarm,
    tag: styles.tagWarm,
    iconColor: Colors.brandBrown,
    tagColor: Colors.brandBrown,
  },
  purple: {
    icon: styles.iconPurple,
    tag: styles.tagPurple,
    iconColor: Colors.brandPurple,
    tagColor: Colors.onTertiaryContainer,
  },
  gold: {
    icon: styles.iconGold,
    tag: styles.tagGold,
    iconColor: Colors.secondaryBrown,
    tagColor: Colors.onSecondaryFixedVariant,
  },
} as const;

const SummaryRow: FC<SummaryRowProps> = ({ icon, tone, label, value, tag, delay = 0 }) => {
  const config = toneConfig[tone];

  return (
    <AnimatedEntrance delay={delay} offsetY={14}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={[styles.iconBox, config.icon]}>
            <AppIcon name={icon} size={moderateScale(20)} color={config.iconColor} />
          </View>
          <View style={styles.copy}>
            <AppText style={styles.label}>{label}</AppText>
            <AppText style={styles.value} numberOfLines={1}>
              {value}
            </AppText>
          </View>
        </View>
        <View style={[styles.tag, config.tag]}>
          <AppText style={[styles.tagText, { color: config.tagColor }]} numberOfLines={1}>
            {tag}
          </AppText>
        </View>
      </View>
    </AnimatedEntrance>
  );
};

export default memo(SummaryRow);
