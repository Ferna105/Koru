import { JumpRecord } from '../../screens/private/tests/jumpTest/jumpTest.types';

export interface TestsService {
  loadJumpHistory: () => Promise<JumpRecord[]>;
  saveJumpRecord: (record: JumpRecord) => Promise<void>;
  deleteJumpRecord: (id: string) => Promise<void>;
  persistVideo: (srcUri: string, id: string) => Promise<string>;
  deleteVideoAt: (uri: string) => Promise<void>;
}

export const JUMP_HISTORY_KEY = 'koru:tests:JUMP:history';
export const JUMP_HISTORY_LIMIT = 50;
