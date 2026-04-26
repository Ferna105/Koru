const G = 9.80665;

export const airtimeToHeightCm = (airtimeMs: number): number => {
  if (!Number.isFinite(airtimeMs) || airtimeMs <= 0) return 0;
  const T = airtimeMs / 1000;
  const heightM = (G * T * T) / 8;
  return heightM * 100;
};

export const formatMs = (ms: number): string => {
  if (!Number.isFinite(ms) || ms < 0) return '00:00.000';
  const totalMs = Math.round(ms);
  const m = Math.floor(totalMs / 60000);
  const s = Math.floor((totalMs % 60000) / 1000);
  const millis = totalMs % 1000;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(
    millis,
  ).padStart(3, '0')}`;
};
