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
import { getKnifeHitHtml } from './knifeHitHtml';
import { MODAL_ICON_SIZE, styles } from './KnifeThrowerGameStyle';

// Workaround for react-native-webview generic P = undefined strict type issue
const GameWebView = WebView as unknown as React.ComponentType<WebViewProps & { ref?: React.Ref<any> }>;

export interface KnifeThrowerGameProps {
  totalKnives?: number;
  initialKnivesCount?: number;
  onSuccess?: (stats: { score: number; stage: number }) => void;
  onFailure?: () => void;
  onExit?: () => void;
  isAlarmMode?: boolean;
}

const KnifeThrowerGame: FC<KnifeThrowerGameProps> = ({
  totalKnives = 7,
  onSuccess,
  onFailure,
  onExit,
  isAlarmMode = false,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [stageCleared, setStageCleared] = useState<boolean>(false);
  const [lastScore, setLastScore] = useState<number>(0);
  const [lastStage, setLastStage] = useState<number>(1);

  const htmlSource = useMemo(() => {
    return { html: getKnifeHitHtml(totalKnives) };
  }, [totalKnives]);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'HIT':
          Vibration.vibrate(25);
          break;

        case 'CLASH':
          Vibration.vibrate([0, 80, 40, 120]);
          setLastScore(data.score ?? 0);
          setLastStage(data.stage ?? 1);
          setGameOver(true);
          onFailure?.();
          break;

        case 'STAGE_CLEAR':
          Vibration.vibrate([0, 60, 40, 60]);
          setLastScore(data.score ?? 0);
          setLastStage(data.stage ?? 1);
          if (isAlarmMode) {
            setStageCleared(true);
            onSuccess?.({ score: data.score ?? 0, stage: data.stage ?? 1 });
          }
          break;

        default:
          break;
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, [isAlarmMode, onFailure, onSuccess]);

  const handleRestart = useCallback(() => {
    setGameOver(false);
    setStageCleared(false);
    webViewRef.current?.postMessage(JSON.stringify({ action: 'RESTART' }));
  }, []);

  const handleClaimSuccess = useCallback(() => {
    onSuccess?.({ score: lastScore, stage: lastStage });
  }, [lastScore, lastStage, onSuccess]);

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

      {/* Game Over Modal Overlay */}
      {gameOver && !isAlarmMode && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppIcon name="x" size={MODAL_ICON_SIZE} color={Colors.error} style={styles.modalIcon} />
            <AppText style={styles.modalTitle}>{gamesString.clashAlert}</AppText>
            <AppText style={styles.modalSubtitle}>
              {gamesString.knifeCardDesc}
            </AppText>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>{gamesString.scoreLabel}</AppText>
                <AppText style={styles.statValue}>{lastScore}</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>{gamesString.stageLabel}</AppText>
                <AppText style={styles.statValue}>{lastStage}</AppText>
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

      {/* Alarm Conquered Overlay */}
      {stageCleared && isAlarmMode && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppIcon name="check" size={MODAL_ICON_SIZE} color={Colors.success} style={styles.modalIcon} />
            <AppText style={styles.modalTitle}>{gamesString.alarmConquered}</AppText>
            <AppText style={styles.modalSubtitle}>
              {gamesString.alarmConqueredSub}
            </AppText>

            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.8}
              onPress={handleClaimSuccess}>
              <AppText style={styles.btnPrimaryText}>{gamesString.claimReward}</AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default memo(KnifeThrowerGame);
