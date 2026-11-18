import React, { FC, memo } from 'react';
import { Text } from 'react-native';
import { AppTextProps } from '../../types';
import { styles } from './AppTextStyle';

const AppText: FC<AppTextProps> = ({
  children,
  style,
  numberOfLines,
  adjustsFontSizeToFit,
  minimumFontScale,
  accessible = true,
  accessibilityLabel,
  accessibilityRole = 'text',
  testID,
}) => {
  return (
    <Text
      style={[styles.text, style]}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      testID={testID}>
      {children}
    </Text>
  );
};

export default memo(AppText);

