import RNFS from 'react-native-fs';
import { UserStats } from '../types';

const STATS_FILE = `${RNFS.DocumentDirectoryPath}/user-stats.json`;

class StatsStorage {
  async load(): Promise<Partial<UserStats> | null> {
    try {
      if (!(await RNFS.exists(STATS_FILE))) return null;
      return JSON.parse(await RNFS.readFile(STATS_FILE, 'utf8'));
    } catch {
      return null;
    }
  }

  async save(stats: UserStats): Promise<void> {
    try {
      await RNFS.writeFile(STATS_FILE, JSON.stringify(stats), 'utf8');
    } catch {
      // Stats are re-saved on the next change.
    }
  }
}

export const StatsStorageService = new StatsStorage();
