import type { ImageSourcePropType } from 'react-native';
import {
  JUMP_TYPES,
  JumpTypeId,
} from 'screens/private/tests/jumpTest/jumpTest.catalog';

export type TestId = 'JUMP';

export type TestDefinition = {
  id: TestId;
  /** Variante del test. Hoy sólo el test de salto tiene variantes. */
  jumpType: JumpTypeId;
  title: string;
  subtitle: string;
  thumbnail: ImageSourcePropType;
};

// Los 5 saltos comparten la misma base funcional (grabar → editar → calcular),
// así que cada tipo de salto entra al catálogo como una variante del test JUMP.
export const TESTS_CATALOG: TestDefinition[] = JUMP_TYPES.map(jump => ({
  id: 'JUMP',
  jumpType: jump.id,
  title: jump.title,
  subtitle: jump.tagline,
  thumbnail: jump.thumbnail,
}));
