import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import MiniAppScreen from './MiniAppScreen';
import { RedMarkingMiniApp } from '../navigation/miniApps';

type Props = NativeStackScreenProps<RootStackParamList, 'RedMarking'>;

export default function RedMarkingScreen({ navigation }: Props) {
  return <MiniAppScreen MiniApp={RedMarkingMiniApp} onBack={() => navigation.goBack()} />;
}
