import React, { FC, memo, useMemo } from 'react';
import { View } from 'react-native';
import AppText from '../app-text/AppText';
import { profileString } from '../../constants';
import { fromDateKey, shiftDateKey, toDateKey } from '../../utils';
import { styles } from './WakeHeatmapStyle';

export interface WakeHeatmapProps {
  history: Record<string, true>;
  trackingSince?: string;
  weeks?: number;
}

type CellState = 'done' | 'missed' | 'idle' | 'future';

interface Cell {
  key: string;
  state: CellState;
  isToday: boolean;
}

// GitHub-style contribution grid: one column per week (Mon-Sun), oldest on the left.
const WakeHeatmap: FC<WakeHeatmapProps> = ({ history, trackingSince, weeks = 15 }) => {
  const todayKey = toDateKey();

  const columns = useMemo(() => {
    const today = fromDateKey(todayKey);
    const mondayOffset = (today.getDay() + 6) % 7;
    const firstMonday = shiftDateKey(todayKey, -(mondayOffset + (weeks - 1) * 7));

    return Array.from({ length: weeks }, (_, w) => {
      const cells: Cell[] = Array.from({ length: 7 }, (__, d) => {
        const key = shiftDateKey(firstMonday, w * 7 + d);
        let state: CellState = 'idle';
        if (key > todayKey) state = 'future';
        else if (history[key]) state = 'done';
        else if (trackingSince && key >= trackingSince && key < todayKey) state = 'missed';
        return { key, state, isToday: key === todayKey };
      });
      return { key: cells[0].key, cells };
    });
  }, [history, trackingSince, todayKey, weeks]);

  const monthLabels = useMemo(() => {
    let lastMonth = -1;
    return columns.map(column => {
      const month = fromDateKey(column.key).getMonth();
      if (month === lastMonth) return '';
      lastMonth = month;
      return profileString.monthNames[month];
    });
  }, [columns]);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.grid}>
          <View style={styles.monthRow}>
            {monthLabels.map((label, index) => (
              <View key={`m-${index}`} style={styles.monthSlot}>
                {label ? (
                  <AppText style={styles.monthText} numberOfLines={1}>
                    {label}
                  </AppText>
                ) : null}
              </View>
            ))}
          </View>

          <View style={styles.weeksRow}>
            {columns.map(column => (
              <View key={column.key} style={styles.weekCol}>
                {column.cells.map(cell => (
                  <View
                    key={cell.key}
                    style={[
                      styles.cell,
                      cell.state === 'done' && styles.cellDone,
                      cell.state === 'missed' && styles.cellMissed,
                      cell.state === 'idle' && styles.cellIdle,
                      cell.state === 'future' && styles.cellFuture,
                      cell.isToday && styles.cellToday,
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, styles.cellMissed]} />
          <AppText style={styles.legendText}>{profileString.legendMissed}</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, styles.cellDone]} />
          <AppText style={styles.legendText}>{profileString.legendDone}</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, styles.cellToday]} />
          <AppText style={styles.legendText}>{profileString.legendToday}</AppText>
        </View>
      </View>
    </View>
  );
};

export default memo(WakeHeatmap);
