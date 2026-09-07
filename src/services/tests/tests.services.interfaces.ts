import { JumpTypeId } from '../../screens/private/tests/jumpTest/jumpTest.catalog';
import { JumpRecord } from '../../screens/private/tests/jumpTest/jumpTest.types';

export interface TestsService {
  /** Sin `jumpType` devuelve el historial completo (todos los saltos). */
  loadJumpHistory: (jumpType?: JumpTypeId) => Promise<JumpRecord[]>;
  saveJumpRecord: (record: JumpRecord) => Promise<void>;
  deleteJumpRecord: (id: string) => Promise<void>;
  persistVideo: (srcUri: string, id: string) => Promise<string>;
  deleteVideoAt: (uri: string) => Promise<void>;
  /**
   * Recorta el MP4 al rango indicado y devuelve la URI del clip nuevo (queda en
   * el directorio de cache). Lanza si el módulo nativo no está disponible.
   */
  trimVideo: (
    srcUri: string,
    startMs: number,
    endMs: number,
  ) => Promise<string>;
}

export const JUMP_HISTORY_KEY = 'koru:tests:JUMP:history';
export const JUMP_HISTORY_LIMIT = 50;
