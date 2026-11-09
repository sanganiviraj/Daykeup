import React, { FC, memo } from 'react';
import { Text } from 'react-native';
import { AppTextProps } from '../../types';
import { styles } from './AppTextStyle';

const AppText: FC<AppTextProps> = ({
  children,
  style,
  numberOfLines,
  accessible = true,
  accessibilityLabel,
  accessibilityRole = 'text',
  testID,
}) => {
  return (
    <Text
      style={[styles.text, style]}
      numberOfLines={numberOfLines}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      testID={testID}>
      {children}
    </Text>
  );
};

export default memo(AppText);

