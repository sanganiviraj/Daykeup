import React, { FC, ReactNode, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from '../app-text/AppText';
import { styles } from './CustomHeaderStyle';

interface CustomHeaderProps {
  title: string;
  onBackPress?: () => void;
  showBack?: boolean;
  rightComponent?: ReactNode;
  showAvatar?: boolean;
  avatarText?: string;
  isDark?: boolean;
}

const CustomHeader: FC<CustomHeaderProps> = ({
  title,
  onBackPress,
  showBack = false,
  rightComponent,
  showAvatar = true,
  avatarText = 'V',
  isDark = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack && onBackPress ? (
          <TouchableOpacity
            onPress={onBackPress}
            style={[styles.backButton, isDark && styles.backButtonDark]}
            accessible={true}
            accessibilityLabel="Back"
            accessibilityRole="button">
            <AppText style={[styles.backText, isDark && styles.textDark]}>
              ‹
            </AppText>
          </TouchableOpacity>
        ) : (
          <View style={styles.logoBadge}>
            <AppText style={styles.logoIcon}>☀️</AppText>
          </View>
        )}
        <AppText style={[styles.titleText, isDark && styles.textDark]}>
          {title}
        </AppText>
      </View>

      <View style={styles.rightContainer}>
        {rightComponent}
        {showAvatar ? (
          <View style={styles.avatarContainer}>
            <AppText style={styles.avatarText}>{avatarText}</AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default memo(CustomHeader);
