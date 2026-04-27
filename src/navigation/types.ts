import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type JumpTestStackParamList = {
  JumpTestHistory: undefined;
  JumpTestExplanation: undefined;
  JumpTestRecord: undefined;
  JumpTestEditor: { videoUri: string; durationMs: number; fps?: number };
  JumpTestResult: {
    videoUri: string;
    startMs: number;
    endMs: number;
    heightCm: number;
    recordId?: string;
  };
};

export type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<HomeTabParamList>;
  Login: undefined;
  JumpTest: NavigatorScreenParams<JumpTestStackParamList>;
  DesignSystem: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type HomeTabParamList = {
  Home: undefined;
  Tests: undefined;
  Profile: undefined;
};

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type JumpTestStackScreenProps<T extends keyof JumpTestStackParamList> =
  CompositeScreenProps<
    StackScreenProps<JumpTestStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
