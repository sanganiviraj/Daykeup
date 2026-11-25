import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, Vibration, View } from 'react-native';
import { WebView, WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import AppText from '../../app-text/AppText';
import AppIcon from '../../app-icon/AppIcon';
import { gamesString } from '../../../constants';
import { Colors } from '../../../theme/Colors';
import { getMonsterTruckHtml } from './monsterTruckHtml';
import { MODAL_ICON_SIZE, styles } from './MonsterTruckGameStyle';

const GameWebView = WebView as unknown as React.ComponentType<WebViewProps & { ref?: React.Ref<any> }>;

export interface MonsterTruckGameProps {
  targetDistance?: number;
  onSuccess?: (stats: { distance: number; coins: number }) => void;
  onExit?: () => void;
  isAlarmMode?: boolean;
}

const MonsterTruckGame: FC<MonsterTruckGameProps> = ({
  targetDistance = 120,
  onSuccess,
  onExit,
  isAlarmMode = false,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [stageCleared, setStageCleared] = useState<boolean>(false);
  const [coins, setCoins] = useState<number>(0);

  const htmlSource = useMemo(() => {
    return { html: getMonsterTruckHtml(targetDistance) };
  }, [targetDistance]);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'COIN':
          Vibration.vibrate(10);
          setCoins(data.coins ?? 0);
          break;

        case 'GAME_OVER':
          Vibration.vibrate([0, 100, 50, 150]);
          break;

        case 'STAGE_CLEAR':
          Vibration.vibrate([0, 60, 40, 60]);
          setCoins(data.coins ?? 0);
          if (isAlarmMode) {
            onSuccess?.({ distance: data.distance ?? targetDistance, coins: data.coins ?? 0 });
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
  }, [isAlarmMode, onSuccess, targetDistance]);

  const handleRestart = useCallback(() => {
    setStageCleared(false);
    setCoins(0);
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
            <AppText style={styles.modalTitle}>{gamesString.truckFinished}</AppText>
            <AppText style={styles.modalSubtitle}>{gamesString.truckFinishedSub}</AppText>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>{gamesString.distanceLabel}</AppText>
                <AppText style={styles.statValue}>{`${targetDistance}${gamesString.metersShort}`}</AppText>
              </View>
              <View style={styles.statItem}>
                <AppText style={styles.statLabel}>{gamesString.coinsLabel}</AppText>
                <AppText style={styles.statValue}>{coins}</AppText>
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

export default memo(MonsterTruckGame);
