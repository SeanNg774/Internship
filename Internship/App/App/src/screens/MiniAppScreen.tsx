import React, { Suspense } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

type Props = {
  MiniApp: React.LazyExoticComponent<React.ComponentType<any>>;
  onBack: () => void;
};

/**
 * Shared chrome around every federated mini-app screen: handles the
 * Suspense loading state while Re.Pack fetches the remote's JS bundle,
 * and a floating back button (kept as a custom absolute-positioned
 * button rather than the native-stack header, so full-screen content
 * like the AR camera preview isn't squeezed by a header bar).
 */
export default function MiniAppScreen({ MiniApp, onBack }: Props) {
  return (
    <View style={styles.container}>
      <Suspense
        fallback={
          <View style={styles.loadingFallback}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        }
      >
        <MiniApp />
      </Suspense>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e2e8f0',
  },
  loadingFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
