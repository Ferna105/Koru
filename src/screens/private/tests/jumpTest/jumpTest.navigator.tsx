import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@react-navigation/native';
import { JumpTestStackParamList, RootStackScreenProps } from 'navigation/types';
import { JumpTestHistory } from './screens/history/jumpTestHistory.screen';
import { JumpTestExplanation } from './screens/explanation/jumpTestExplanation.screen';
import { JumpTestRecord } from './screens/record/jumpTestRecord.screen';
import { JumpTestEditor } from './screens/editor/jumpTestEditor.screen';
import { JumpTestResult } from './screens/result/jumpTestResult.screen';

const Stack = createNativeStackNavigator<JumpTestStackParamList>();

export const JumpTestNavigator = ({}: RootStackScreenProps<'JumpTest'>) => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.background,
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitle: '',
      }}>
      <Stack.Screen
        name="JumpTestHistory"
        component={JumpTestHistory}
        options={{ title: 'SALTOS' }}
      />
      <Stack.Screen
        name="JumpTestExplanation"
        component={JumpTestExplanation}
        options={{ title: 'SALTOS' }}
      />
      <Stack.Screen
        name="JumpTestRecord"
        component={JumpTestRecord}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JumpTestEditor"
        component={JumpTestEditor}
        options={{ title: 'SALTOS' }}
      />
      <Stack.Screen
        name="JumpTestResult"
        component={JumpTestResult}
        options={{ title: 'SALTOS' }}
      />
    </Stack.Navigator>
  );
};
