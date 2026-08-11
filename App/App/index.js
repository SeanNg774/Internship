import { AppRegistry, Platform } from 'react-native';
import { ScriptManager, Federated } from '@callstack/repack/client';
import App from './App';
import { name as appName } from './app.json';


// 1. The Phonebook (Registry)
// This tells the Host App exactly which port each Mini-App is running on locally.
ScriptManager.shared.addResolver(async (scriptId, caller) => {
  const containers = {
    Contract: 'http://localhost:8082/[name][ext]',
    AR: 'http://localhost:8083/[name][ext]',
    RedMarking: 'http://localhost:8084/[name][ext]',
  };

  const url = containers[scriptId];

  if (url) {
    return {
      url,
      cache: false, // Keep this false during development so Fast Refresh works!
      query: {
        platform: Platform.OS, 
      },
    };
  }

  return undefined;
});

AppRegistry.registerComponent(appName, () => App);