import React, { useState, useCallback ,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

const FALLBACK_BRIDGE = {
  Camera: null,
  useCameraDevice: () => null,
  useCameraPermission: () => ({ hasPermission: false, requestPermission: async () => {} }),
  usePhotoOutput: () => null,
};

const ARApp = () => {
  console.log('[ARApp] Mounted - AR mini-app rendering for the first time');

  const bridge = (global.NativeBridge && global.NativeBridge.camera) || FALLBACK_BRIDGE;
  const { Camera, useCameraDevice, useCameraPermission, usePhotoOutput } = bridge;
 
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const photoOutput = usePhotoOutput();
 
  const [photoUri, setPhotoUri] = useState(null);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    if (!hasPermission) {
      console.log('[ARApp] No permission yet - calling requestPermission()');
      requestPermission();
    } else {
      console.log('[ARApp] Permission already granted');
    }
  }, [hasPermission, requestPermission]);
 
  if (!global.NativeBridge || !global.NativeBridge.camera) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera bridge not available.</Text>
        <Text style={styles.subtitle}>Is the host registering RealCameraBridge?</Text>
      </View>
    );
  }
 
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission…</Text>
      </View>
    );
  }
 
  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No camera device found on this device.</Text>
      </View>
    );
  }
 
  const handleCapture = async () => {
    console.log('[ARApp] Capture button pressed - calling capturePhotoToFile()');
    try {
      const { filePath } = await photoOutput.capturePhotoToFile({}, {});
      console.log(`[ARApp] Photo captured -> ${filePath}`);
      setPhotoUri(`file://${filePath}`);
    } catch (err) {
      console.log(`[ARApp] Capture failed: ${err.message}`);
      setError(err.message);
    }
  };
 
  return (
    <View style={styles.fill}>
      {!photoUri ? (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            isActive={true}
            device={device}
            outputs={[photoOutput]}
          />
          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={handleCapture}>
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={() => setPhotoUri(null)}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    padding: 20,
  },
  fill: {
    flex: 1,
    backgroundColor: '#000',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#fee2e2',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  buttonText: {
    color: '#111',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    color: '#fff',
    backgroundColor: '#991b1b',
    padding: 8,
    borderRadius: 6,
  },
});
 
export default ARApp;