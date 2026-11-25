import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';

const PHOTO_DIR = `${RNFS.DocumentDirectoryPath}/motivation`;
const FILE_SCHEME = 'file://';

export type PhotoPickResult =
  | { status: 'picked'; uri: string }
  | { status: 'cancelled' }
  | { status: 'error' };

const toPath = (uri: string): string =>
  uri.startsWith(FILE_SCHEME) ? uri.slice(FILE_SCHEME.length) : uri;

class PhotoStorageService {
  // Opens the gallery and copies the chosen photo into app storage. The
  // picker's own result lives in a cache folder the OS may clear, which would
  // leave an alarm without its photo weeks later.
  async pickAndStorePhoto(): Promise<PhotoPickResult> {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.8,
      });

      if (response.didCancel) {
        return { status: 'cancelled' };
      }
      const sourceUri = response.assets?.[0]?.uri;
      if (response.errorCode || !sourceUri) {
        return { status: 'error' };
      }

      await RNFS.mkdir(PHOTO_DIR);
      const destination = `${PHOTO_DIR}/photo-${Date.now()}.jpg`;
      await RNFS.copyFile(toPath(sourceUri), destination);
      return { status: 'picked', uri: `${FILE_SCHEME}${destination}` };
    } catch {
      return { status: 'error' };
    }
  }

  // Only removes files this service created.
  async deleteStoredPhoto(uri?: string): Promise<void> {
    if (!uri) return;
    const path = toPath(uri);
    if (!path.startsWith(PHOTO_DIR)) return;
    try {
      if (await RNFS.exists(path)) {
        await RNFS.unlink(path);
      }
    } catch {
      // Best effort cleanup.
    }
  }
}

export const PhotoService = new PhotoStorageService();
