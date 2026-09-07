import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { NativeModules, Platform } from 'react-native';
import {
  JumpTypeId,
  LEGACY_JUMP_TYPE,
} from '../../screens/private/tests/jumpTest/jumpTest.catalog';
import { JumpRecord } from '../../screens/private/tests/jumpTest/jumpTest.types';
import {
  JUMP_HISTORY_KEY,
  JUMP_HISTORY_LIMIT,
  TestsService,
} from './tests.services.interfaces';

const KORU_DIR = `${RNFS.DocumentDirectoryPath}/koru`;

// Módulo nativo local (modules/koru-video-trim). Si la app corre sobre un build
// anterior a su incorporación, `KoruVideoTrim` llega undefined.
const { KoruVideoTrim } = NativeModules as {
  KoruVideoTrim?: {
    trim: (
      sourcePath: string,
      startMs: number,
      endMs: number,
    ) => Promise<string>;
  };
};

const ensureDir = async () => {
  const exists = await RNFS.exists(KORU_DIR);
  if (!exists) {
    await RNFS.mkdir(KORU_DIR);
  }
};

const stripScheme = (uri: string) =>
  uri.startsWith('file://') ? uri.replace('file://', '') : uri;

const withScheme = (path: string) =>
  path.startsWith('file://') ? path : `file://${path}`;

// Los registros previos a los 5 tipos de salto no tienen `jumpType`: el test
// original era un salto vertical libre, equivalente al salto con impulso.
const normalize = (record: JumpRecord): JumpRecord => ({
  ...record,
  jumpType: record.jumpType ?? LEGACY_JUMP_TYPE,
});

const readAll = async (): Promise<JumpRecord[]> => {
  const raw = await AsyncStorage.getItem(JUMP_HISTORY_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as JumpRecord[]).map(normalize) : [];
  } catch {
    return [];
  }
};

export const testsService: TestsService = {
  loadJumpHistory: async (jumpType?: JumpTypeId) => {
    const all = await readAll();
    return jumpType ? all.filter(r => r.jumpType === jumpType) : all;
  },

  saveJumpRecord: async record => {
    const current = await readAll();
    const next = [record, ...current.filter(r => r.id !== record.id)].slice(
      0,
      JUMP_HISTORY_LIMIT,
    );
    await AsyncStorage.setItem(JUMP_HISTORY_KEY, JSON.stringify(next));
  },

  deleteJumpRecord: async id => {
    const current = await readAll();
    const target = current.find(r => r.id === id);
    if (target) {
      const path = stripScheme(target.videoUri);
      try {
        const exists = await RNFS.exists(path);
        if (exists) {
          await RNFS.unlink(path);
        }
      } catch {
        // swallow: file may already be gone
      }
    }
    const next = current.filter(r => r.id !== id);
    await AsyncStorage.setItem(JUMP_HISTORY_KEY, JSON.stringify(next));
  },

  deleteVideoAt: async uri => {
    if (!uri) {
      return;
    }
    const path = stripScheme(uri);
    try {
      const exists = await RNFS.exists(path);
      if (exists) {
        await RNFS.unlink(path);
      }
    } catch {
      // swallow: file may already be gone
    }
  },

  trimVideo: async (srcUri, startMs, endMs) => {
    if (!KoruVideoTrim) {
      throw new Error('KoruVideoTrim no está disponible en este build');
    }
    const path = await KoruVideoTrim.trim(stripScheme(srcUri), startMs, endMs);
    return Platform.OS === 'android' ? withScheme(path) : path;
  },

  persistVideo: async (srcUri, id) => {
    await ensureDir();
    const dest = `${KORU_DIR}/${id}.mp4`;
    const src = stripScheme(srcUri);
    const alreadyPersisted = src === dest;
    if (alreadyPersisted) {
      return Platform.OS === 'android' ? withScheme(dest) : dest;
    }
    const destExists = await RNFS.exists(dest);
    if (destExists) {
      try {
        await RNFS.unlink(dest);
      } catch {
        // continue
      }
    }
    try {
      await RNFS.moveFile(src, dest);
    } catch {
      await RNFS.copyFile(src, dest);
    }
    return Platform.OS === 'android' ? withScheme(dest) : dest;
  },
};
