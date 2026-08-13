import { AppRegistry, Platform } from 'react-native';
import { ScriptManager, Federated, Script} from '@callstack/repack/client';
import App from './App';
import { name as appName } from './app.json';



// 1. The Phonebook (Registry)
// This tells the Host App exactly which port each Mini-App is running on locally.
ScriptManager.shared.addResolver(async (scriptId, caller) => {
  const localhost = Platform.OS === 'android' ? '10.0.2.2': 'localhost';
  // 1. Check if the Host is requesting the Contract Mini-App
  if (scriptId === 'contract_app' || scriptId === 'Contract'|| scriptId === 'contract') {
    return {
      // Use backticks (`) to dynamically inject the scriptId!
      url: `http://localhost:8082/${scriptId}.container.bundle`, 
      cache: false,
      query: {
        platform: Platform.OS,
      },
      verifyScriptSignature: 'off',
    };
  }

  // 2. Default fallback for normal Host App chunks
  return {
    url: Script.getDevServerURL(scriptId),
    cache: false,
    query: {
      platform: Platform.OS,
    },
    verifyScriptSignature: 'off',
  };
});

AppRegistry.registerComponent(appName, () => App);