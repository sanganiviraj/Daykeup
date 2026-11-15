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
import { getCurvePongHtml } from './curvePongHtml';
import { MODAL_ICON_SIZE, styles } from './CurvePongGameStyle';

const GameWebView = WebView as unknown as React.ComponentType<WebViewProps & { ref?: React.Ref<any> }>;

export interface CurvePongGameProps {
  targetScore?: number;
  onSuccess?: (stats: { scorePlayer: number; scoreOpponent: number }) => void;
  onFailure?: () => void;
  onExit?: () => void;
  isAlarmMode?: boolean;
}

const CurvePongGame: FC<CurvePongGameProps> = ({
  targetScore = 2,
  onSuccess,
  onFailure,
  onExit,
  isAlarmMode = false,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [winner, setWinner] = useState<'p1' | 'p2' | null>(null);
  const [finalScoreP1, setFinalScoreP1] = useState<number>(0);
  const [finalScoreP2, setFinalScoreP2] = useState<number>(0);

  const htmlSource = useMemo(() => {
    return { html: getCurvePongHtml(targetScore) };
  }, [targetScore]);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'HIT':
          Vibration.vibrate(18);
          break;

        case 'POINT':
          Vibration.vibrate([0, 70, 40, 100]);
          break;

        case 'GAME_OVER':
          Vibration.vibrate([0, 100, 50, 150]);
          setWinner(data.winner);
          setFinalScoreP1(data.scoreP1 ?? 0);
          setFinalScoreP2(data.scoreP2 ?? 0);

          if (data.winner === 'p1') {
            if (isAlarmMode) {
              onSuccess?.({
                scorePlayer: data.scoreP1 ?? 0,
                scoreOpponent: data.scoreP2 ?? 0,
              });
            }
          } else {
            onFailure?.();
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
    setWinner(null);
    webViewRef.current?.reload();
  }, []);

  const handleClaimSuccess = useCallback(() => {
    onSuccess?.({
      scorePlayer: finalScoreP1,
      scoreOpponent: finalScoreP2,
    });
  }, [finalScoreP1, finalScoreP2, onSuccess]);

  const isPlayerWon = winner === 'p1';

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

      {/* Match Result Overlay */}
      {winner && !isAlarmMode && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppIcon
              name={isPlayerWon ? 'trophy' : 'heartCrack'}
              size={MODAL_ICON_SIZE}
              color={isPlayerWon ? Colors.brandOrange : Colors.error}
              style={styles.modalIcon}
            />
            <AppText style={styles.modalTitle}>
              {isPlayerWon ? gamesString.matchWon : gamesString.matchLost}
            </AppText>
            <AppText style={styles.modalSubtitle}>
              {gamesString.pongCardDesc}
            </AppText>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>{gamesString.playerScore}</AppText>
                <AppText style={[styles.statValue, { color: Colors.azure }]}>
                  {finalScoreP1}
                </AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>{gamesString.opponentScore}</AppText>
                <AppText style={[styles.statValue, { color: Colors.melon }]}>
                  {finalScoreP2}
                </AppText>
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
      {winner && isAlarmMode && isPlayerWon && (
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

export default memo(CurvePongGame);

