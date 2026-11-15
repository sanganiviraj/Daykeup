import React, { FC, ReactNode, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from '../app-text/AppText';
import AppIcon from '../app-icon/AppIcon';
import { Colors } from '../../theme/Colors';
import { commonString } from '../../constants';
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

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

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
            hitSlop={HIT_SLOP}
            accessibilityLabel={commonString.back}
            accessibilityRole="button">
            <AppIcon
              name="chevronLeft"
              size="xl"
              strokeWidth={2.25}
              color={isDark ? Colors.white : Colors.textMain}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoBadge}>
            <AppIcon name="sun" size="md" color={Colors.white} />
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
