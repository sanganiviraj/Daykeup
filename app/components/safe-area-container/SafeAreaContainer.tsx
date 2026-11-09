import React, { FC, memo } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaContainerProps } from '../../types';
import { Colors } from '../../theme/Colors';
import { styles } from './SafeAreaContainerStyle';

const SafeAreaContainer: FC<SafeAreaContainerProps> = ({
  children,
  edges = ['top', 'left', 'right'],
  style,
  backgroundColor = Colors.dune,
  isDark = false,
}) => {
  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor }, style]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.innerContainer}>{children}</View>
    </SafeAreaView>
  );
};

export default memo(SafeAreaContainer);
