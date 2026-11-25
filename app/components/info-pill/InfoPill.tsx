import React, { FC, memo } from 'react';
import { View } from 'react-native';
import AppText from '../app-text/AppText';
import AppIcon from '../app-icon/AppIcon';
import { InfoPillProps, InfoPillTone } from '../../types';
import { Colors } from '../../theme/Colors';
import { moderateScale } from '../../theme/Metrics';
import { styles } from './InfoPillStyle';

const toneStyles = {
  amber: { container: styles.amber, text: styles.amberText, icon: Colors.primary },
  purple: { container: styles.purple, text: styles.purpleText, icon: Colors.brandPurple },
  white: { container: styles.white, text: styles.whiteText, icon: Colors.primary },
  dark: { container: styles.dark, text: styles.darkText, icon: Colors.primaryContainer },
} as const;

const InfoPill: FC<InfoPillProps> = ({ text, icon, tone = 'amber', style, testID }) => {
  const toneStyle = toneStyles[tone as InfoPillTone];

  return (
    <View style={[styles.container, toneStyle.container, style]} testID={testID}>
      {icon ? <AppIcon name={icon} size={moderateScale(13)} color={toneStyle.icon} /> : null}
      <AppText style={[styles.text, toneStyle.text]}>{text}</AppText>
    </View>
  );
};

export default memo(InfoPill);
