import React, { FC, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from '../app-text/AppText';
import { CustomButtonProps } from '../../types';
import { styles } from './CustomButtonStyle';

const CustomButton: FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  titleTextStyle,
  disabled = false,
  accessible = true,
  accessibilityLabel,
  accessibilityRole = 'button',
  testID,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.buttonContainerStyle,
        style,
        disabled && styles.disabledButton,
      ]}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole={accessibilityRole}
      testID={testID}>
      {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
      <AppText style={[styles.titleTextStyle, titleTextStyle]}>{title}</AppText>
    </TouchableOpacity>
  );
};

export default memo(CustomButton);

