import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { JumpTypeId } from 'screens/private/tests/jumpTest/jumpTest.catalog';

export type JumpTestStackParamList = {
  /** Sin `jumpType` muestra el historial de todos los saltos. */
  JumpTestHistory: { jumpType?: JumpTypeId } | undefined;
  JumpTestExplanation: { jumpType: JumpTypeId };
  JumpTestRecord: { jumpType: JumpTypeId };
  JumpTestEditor: {
    jumpType: JumpTypeId;
    videoUri: string;
    durationMs: number;
    fps?: number;
  };
  JumpTestResult: {
    jumpType: JumpTypeId;
    videoUri: string;
    startMs: number;
    endMs: number;
    heightCm: number;
    recordId?: string;
  };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  MyProfile: undefined;
  About: undefined;
};

export type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<HomeTabParamList>;
  Login: undefined;
  JumpTest: NavigatorScreenParams<JumpTestStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type HomeTabParamList = {
  Home: undefined;
  Tests: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ProfileStackParamList, T>,
    HomeTabScreenProps<keyof HomeTabParamList>
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
