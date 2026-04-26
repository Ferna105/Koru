export type JumpRecord = {
  id: string;
  testId: 'JUMP';
  createdAt: string;
  videoUri: string;
  startMs: number;
  endMs: number;
  airtimeMs: number;
  heightCm: number;
};
