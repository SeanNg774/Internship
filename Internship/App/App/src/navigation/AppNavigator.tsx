import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import ARScreen from '../screens/ARScreen';
import RedMarkingScreen from '../screens/RedMarkingScreen';

export type RootStackParamList = {
  Dashboard: undefined;
  AR: undefined;
  RedMarking: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{ headerShown: false }} // mini-app screens draw their own back button
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="AR" component={ARScreen} />
        <Stack.Screen name="RedMarking" component={RedMarkingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
