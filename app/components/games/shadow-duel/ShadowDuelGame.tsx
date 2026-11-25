import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, Vibration, View } from 'react-native';
import { WebView, WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import AppText from '../../app-text/AppText';
import AppIcon from '../../app-icon/AppIcon';
import { gamesString } from '../../../constants';
import { Colors } from '../../../theme/Colors';
import { getShadowDuelHtml } from './shadowDuelHtml';
import { MODAL_ICON_SIZE, styles } from './ShadowDuelGameStyle';

const GameWebView = WebView as unknown as React.ComponentType<WebViewProps & { ref?: React.Ref<any> }>;

export interface ShadowDuelGameProps {
  enemyHp?: number;
  onSuccess?: (stats: { hp: number; combo: number }) => void;
  onExit?: () => void;
  isAlarmMode?: boolean;
}

const ShadowDuelGame: FC<ShadowDuelGameProps> = ({
  enemyHp = 70,
  onSuccess,
  onExit,
  isAlarmMode = false,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [stageCleared, setStageCleared] = useState<boolean>(false);
  const [hpLeft, setHpLeft] = useState<number>(0);
  const [bestCombo, setBestCombo] = useState<number>(0);

  const htmlSource = useMemo(() => {
    return { html: getShadowDuelHtml(enemyHp) };
  }, [enemyHp]);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'HIT':
          Vibration.vibrate(12);
          break;

        case 'DAMAGE':
          Vibration.vibrate(30);
          break;

        case 'BLOCK':
          Vibration.vibrate(8);
          break;

        case 'PARRY':
          Vibration.vibrate([0, 20, 30, 20]);
          break;

        case 'GAME_OVER':
          Vibration.vibrate([0, 100, 50, 150]);
          break;

        case 'STAGE_CLEAR':
          Vibration.vibrate([0, 60, 40, 60]);
          setHpLeft(data.hp ?? 0);
          setBestCombo(data.combo ?? 0);
          if (isAlarmMode) {
            onSuccess?.({ hp: data.hp ?? 0, combo: data.combo ?? 0 });
          } else {
            setStageCleared(true);
          }
          break;

        default:
          break;
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, [isAlarmMode, onSuccess]);

  const handleRestart = useCallback(() => {
    setStageCleared(false);
    webViewRef.current?.postMessage(JSON.stringify({ action: 'RESTART' }));
  }, []);

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

      {stageCleared && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppIcon name="check" size={MODAL_ICON_SIZE} color={Colors.success} style={styles.modalIcon} />
            <AppText style={styles.modalTitle}>{gamesString.duelWon}</AppText>
            <AppText style={styles.modalSubtitle}>{gamesString.duelWonSub}</AppText>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>{gamesString.healthLeftLabel}</AppText>
                <AppText style={styles.statValue}>{hpLeft}</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>{gamesString.bestComboLabel}</AppText>
                <AppText style={styles.statValue}>{bestCombo}</AppText>
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
    </View>
  );
};

export default memo(ShadowDuelGame);
