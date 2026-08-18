import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import MiniAppScreen from './MiniAppScreen';
import { ARMiniApp } from '../navigation/miniApps';

type Props = NativeStackScreenProps<RootStackParamList, 'AR'>;

export default function ARScreen({ navigation }: Props) {
  return <MiniAppScreen MiniApp={ARMiniApp} onBack={() => navigation.goBack()} />;
}
