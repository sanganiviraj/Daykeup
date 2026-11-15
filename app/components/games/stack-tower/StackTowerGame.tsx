import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { WebView, WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import AppText from '../../app-text/AppText';
import AppIcon from '../../app-icon/AppIcon';
import { gamesString } from '../../../constants';
import { Colors } from '../../../theme/Colors';
import { getStackTowerHtml } from './stackTowerHtml';
import { MODAL_ICON_SIZE, styles } from './StackTowerGameStyle';

const GameWebView = WebView as unknown as React.ComponentType<WebViewProps & { ref?: React.Ref<any> }>;

export interface StackTowerGameProps {
  targetHeight?: number;
  onSuccess?: (stats: { score: number; combo: number }) => void;
  onFailure?: () => void;
  onExit?: () => void;
  isAlarmMode?: boolean;
}

const StackTowerGame: FC<StackTowerGameProps> = ({
  targetHeight = 10,
  onSuccess,
  onFailure,
  onExit,
  isAlarmMode = false,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [stageCleared, setStageCleared] = useState<boolean>(false);
  const [lastScore, setLastScore] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);

  const htmlSource = useMemo(() => {
    return { html: getStackTowerHtml(targetHeight) };
  }, [targetHeight]);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'PERFECT':
          Vibration.vibrate(25);
          setLastScore(data.score ?? 0);
          if ((data.combo ?? 0) > highestCombo) {
            setHighestCombo(data.combo ?? 0);
          }
          break;

        case 'STACK':
          Vibration.vibrate(15);
          setLastScore(data.score ?? 0);
          break;

        case 'STAGE_CLEAR':
          Vibration.vibrate([0, 60, 40, 60]);
          setLastScore(data.score ?? targetHeight);
          setStageCleared(true);
          if (isAlarmMode) {
            onSuccess?.({ score: data.score ?? targetHeight, combo: highestCombo });
          }
          break;

        case 'GAME_OVER':
          Vibration.vibrate([0, 100, 50, 150]);
          setLastScore(data.score ?? 0);
          setGameOver(true);
          onFailure?.();
          break;

        default:
          break;
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, [highestCombo, isAlarmMode, onFailure, onSuccess, targetHeight]);

  const handleRestart = useCallback(() => {
    setGameOver(false);
    setStageCleared(false);
    webViewRef.current?.postMessage(JSON.stringify({ action: 'RESTART' }));
  }, []);

  const handleClaimSuccess = useCallback(() => {
    onSuccess?.({ score: lastScore, combo: highestCombo });
  }, [highestCombo, lastScore, onSuccess]);

  return (
    <View style={styles.container}>
      <GameWebView
        ref={webViewRef}
        source={htmlSource}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onMessage={handleMessage}
      />

      {/* Game Over Modal */}
      {gameOver && !isAlarmMode && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppIcon name="brickWall" size={MODAL_ICON_SIZE} color={Colors.error} style={styles.modalIcon} />
            <AppText style={styles.modalTitle}>{gamesString.stackToppled}</AppText>
            <AppText style={styles.modalSubtitle}>{gamesString.stackCardDesc}</AppText>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>{gamesString.towerHeightLabel}</AppText>
                <AppText style={styles.statValue}>{lastScore}</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>{gamesString.comboLabel}</AppText>
                <AppText style={styles.statValue}>{highestCombo}</AppText>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.8}
              onPress={handleRestart}>
              <AppText style={styles.btnPrimaryText}>{gamesString.playAgain}</AppText>
            </TouchableOpacity>

            {onExit && (
              <TouchableOpacity
                style={styles.btnSecondary}
                activeOpacity={0.8}
                onPress={onExit}>
                <AppText style={styles.btnSecondaryText}>{gamesString.exitGame}</AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Victory / Alarm Conquered Modal */}
      {stageCleared && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppIcon name="check" size={MODAL_ICON_SIZE} color={Colors.success} style={styles.modalIcon} />
            <AppText style={styles.modalTitle}>{gamesString.alarmConquered}</AppText>
            <AppText style={styles.modalSubtitle}>{gamesString.alarmConqueredSub}</AppText>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>{gamesString.towerHeightLabel}</AppText>
                <AppText style={styles.statValue}>{lastScore}</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>{gamesString.comboLabel}</AppText>
                <AppText style={styles.statValue}>{highestCombo}</AppText>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.8}
              onPress={isAlarmMode ? handleClaimSuccess : handleRestart}>
              <AppText style={styles.btnPrimaryText}>
                {isAlarmMode ? gamesString.claimReward : gamesString.playAgain}
              </AppText>
            </TouchableOpacity>

            {onExit && (
              <TouchableOpacity
                style={styles.btnSecondary}
                activeOpacity={0.8}
                onPress={onExit}>
                <AppText style={styles.btnSecondaryText}>{gamesString.exitGame}</AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default memo(StackTowerGame);

