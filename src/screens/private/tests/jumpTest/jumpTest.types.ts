import { JumpTypeId } from './jumpTest.catalog';

export type JumpRecord = {
  id: string;
  testId: 'JUMP';
  /**
   * Tipo de salto ejecutado. Los registros guardados antes de los 5 saltos no
   * lo traen; `testsService.loadJumpHistory` los normaliza al cargarlos.
   */
  jumpType: JumpTypeId;
  createdAt: string;
  videoUri: string;
  startMs: number;
  endMs: number;
  airtimeMs: number;
  heightCm: number;
};
