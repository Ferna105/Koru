// Catálogo de los 5 tipos de salto que se pueden testear.
// Cada tipo comparte la misma base funcional (grabar → editar → calcular altura)
// y sólo cambia la consigna y el video explicativo que se muestra antes de filmar.

import type { ImageSourcePropType } from 'react-native';

export type JumpTypeId =
  | 'DEEP_SQUAT'
  | 'ARM_SWING'
  | 'NO_ARM_SWING'
  | 'BOX_DROP'
  | 'SINGLE_LEG';

export type JumpTypeDefinition = {
  id: JumpTypeId;
  /** Nombre completo del salto (se muestra en mayúsculas en las cards). */
  title: string;
  /** Consigna corta para listados. */
  tagline: string;
  /** Consigna completa provista por el equipo técnico. */
  description: string;
  /** Asset local del video explicativo (el `uri` que espera react-native-video). */
  video: NodeRequire;
  /** Frame representativo del video, usado como miniatura en los listados. */
  thumbnail: ImageSourcePropType;
};

/** Aclaración válida para los 5 saltos. */
export const JUMP_UNIVERSAL_NOTE =
  'El salto debe ser vertical, asegurándose de caer en el mismo lugar del apoyo inicial.';

export const JUMP_TYPES: JumpTypeDefinition[] = [
  {
    id: 'DEEP_SQUAT',
    title: 'Salto sentadilla profunda',
    tagline: '3 segundos inmóvil y saltás',
    description:
      'Una vez en posición de sentadilla profunda permanecer inmóvil 3 segundos y luego saltar.',
    video: require('../../../../../assets/videos/salto-sentadilla-profunda.mp4'),
    thumbnail: require('../../../../../assets/thumbnails/salto-sentadilla-profunda.jpg'),
  },
  {
    id: 'ARM_SWING',
    title: 'Salto con impulso',
    tagline: 'Con impulso de brazos',
    description:
      'El salto vertical se realiza con la ayuda del impulso de los brazos.',
    video: require('../../../../../assets/videos/salto-con-impulso.mp4'),
    thumbnail: require('../../../../../assets/thumbnails/salto-con-impulso.jpg'),
  },
  {
    id: 'NO_ARM_SWING',
    title: 'Salto sin impulso',
    tagline: 'Manos en la cadera',
    description:
      'El salto debe realizarse con las manos en la cadera durante todo el recorrido.',
    video: require('../../../../../assets/videos/salto-sin-impulso.mp4'),
    thumbnail: require('../../../../../assets/thumbnails/salto-sin-impulso.jpg'),
  },
  {
    id: 'BOX_DROP',
    title: 'Salto desde el cajón',
    tagline: 'Caés del cajón y saltás',
    description:
      'El cajón debe estar a la altura en donde el atleta sienta la mayor comodidad de salto al aterrizar. Un banco muy bajo no ofrecerá la suficiente carga elástica y un cajón muy alto perjudicará la fuerza del salto.',
    video: require('../../../../../assets/videos/salto-desde-el-cajon.mp4'),
    thumbnail: require('../../../../../assets/thumbnails/salto-desde-el-cajon.jpg'),
  },
  {
    id: 'SINGLE_LEG',
    title: 'Salto a un pie',
    tagline: 'Un solo pie en el piso',
    description:
      'El salto debe realizarse con un solo pie en el piso. Los brazos y la pierna que queda en el aire deben utilizarse a favor para llevar impulso.',
    video: require('../../../../../assets/videos/salto-a-un-pie.mp4'),
    thumbnail: require('../../../../../assets/thumbnails/salto-a-un-pie.jpg'),
  },
];

/**
 * Tipo asignado a los registros guardados antes de que existieran los 5 saltos:
 * el test original era un salto vertical libre, equivalente al salto con impulso.
 */
export const LEGACY_JUMP_TYPE: JumpTypeId = 'ARM_SWING';

export const getJumpType = (id: JumpTypeId): JumpTypeDefinition =>
  JUMP_TYPES.find(jump => jump.id === id) ??
  JUMP_TYPES.find(jump => jump.id === LEGACY_JUMP_TYPE)!;
