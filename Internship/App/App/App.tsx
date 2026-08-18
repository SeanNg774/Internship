import React, { useState, Suspense } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Federated } from '@callstack/repack/client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// 1. Dynamically import the Mini-Apps Over-The-Air (Locally)
const ARMiniApp = React.lazy(() => Federated.importModule('ar_app', './App'));
const RedMarkingMiniApp = React.lazy(() => Federated.importModule('redmarking_app', './App'));

export default function App() {
  // State to track which mini-app is currently "open"
  const [activeApp, setActiveApp] = useState<string | null>(null);

  // Helper function to render the placeholder for the mini-app
  const renderMiniApp = () => {
    if (!activeApp) return null;

    let MiniAppToRender;
    if (activeApp === 'ar_app') MiniAppToRender = ARMiniApp;
    if (activeApp === 'redmarking_app') MiniAppToRender = RedMarkingMiniApp;

    return (
      <View style={styles.miniAppContainer}>
        {/* Suspense shows a loading spinner while Re.Pack fetches the JS bundle */}
        <Suspense
          fallback={
            <View style={styles.loadingFallback}>
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          }
        >
          {MiniAppToRender && <MiniAppToRender />}
        </Suspense>
        
        <TouchableOpacity style={styles.backButton} onPress={() => setActiveApp(null)}>
          <Text style={styles.buttonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {!activeApp ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#3b82f6' }]} 
            onPress={() => setActiveApp('ar_app')}
          >
            <Text style={styles.buttonText}> AR App</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#23c86a' }]} 
            onPress={() => setActiveApp('redmarking_app')}
          >
            <Text style={styles.buttonText}> Red Marking App</Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderMiniApp()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#0f172a',
  },
  buttonContainer: {
    width: '80%',
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  miniAppContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e2e8f0',
  },
  loadingFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAppText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0f172a',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: '#64748b',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  }
});