import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

const ARApp = () => {
  const [status, setStatus] = useState('idle'); // idle | requesting | ready | previewing | error
  const [photo, setPhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Mini-apps never import a camera library directly — they only ever
  // talk to the bridge the host registered on global.NativeBridge.
  const camera = global.NativeBridge && global.NativeBridge.camera;

  const handleStart = useCallback(async () => {
    if (!camera) {
      setErrorMessage('Camera bridge not available. Is the host registering it?');
      setStatus('error');
      return;
    }
    try {
      setStatus('requesting');
      const { status: permStatus } = await camera.requestPermission();
      if (permStatus !== 'granted') {
        setErrorMessage('Camera permission denied.');
        setStatus('error');
        return;
      }
      await camera.startPreview();
      setStatus('previewing');
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  }, [camera]);

  const handleCapture = useCallback(async () => {
    if (!camera) return;
    try {
      const result = await camera.capturePhoto();
      setPhoto(result);
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  }, [camera]);

  const handleStop = useCallback(async () => {
    if (!camera) return;
    await camera.stopPreview();
    setStatus('idle');
    setPhoto(null);
  }, [camera]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>AR Mini-App</Text>
      <Text style={styles.subtitle}>Camera bridge status: {status}</Text>

      <View style={styles.previewBox}>
        {status === 'requesting' && <ActivityIndicator color="#fff" />}
        {status === 'previewing' && !photo && (
          <Text style={styles.previewLabel}>[ mock camera preview ]</Text>
        )}
        {photo && (
          <Image
            source={{ uri: photo.uri }}
            style={styles.photoPreview}
            resizeMode="contain"
          />
        )}
        {status === 'idle' && <Text style={styles.previewLabel}>Camera off</Text>}
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.buttonRow}>
        {status !== 'previewing' ? (
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Start Camera</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleCapture}>
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={handleStop}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fee2e2',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  previewBox: {
    width: '100%',
    height: 240,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  previewLabel: {
    color: '#fca5a5',
    fontSize: 14,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: '#fff',
    backgroundColor: '#991b1b',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: '#7f1d1d',
  },
  buttonText: {
    color: '#ef4444',
    fontWeight: '700',
  },
});

export default ARApp;