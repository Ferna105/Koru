export type TestId = 'JUMP';

export type TestDefinition = {
  id: TestId;
  title: string;
  featured: boolean;
};

export const TESTS_CATALOG: TestDefinition[] = [
  {
    id: 'JUMP',
    title: 'SALTOS',
    featured: true,
  },
];
