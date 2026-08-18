/**
 * RealCameraBridge — backs global.NativeBridge.camera with the actual
 * react-native-vision-camera library.
 *
 * IMPORTANT SHAPE CHANGE from the mock:
 * The mock exposed plain async methods (requestPermission, capturePhoto...)
 * because it didn't need a real native view. vision-camera's preview IS a
 * live native view + React hooks, so this bridge instead exposes the hooks
 * and the <Camera /> component itself. The AR mini-app calls these hooks
 * inside its own component — this works because 'react' is shared as a
 * singleton in your ModuleFederationPlugin config, so the mini-app and the
 * host share the exact same React instance/dispatcher at runtime.
 *
 * The mini-app still never imports react-native-vision-camera directly —
 * only the host's package.json/native project needs it installed.
 */
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';

export function registerRealCameraBridge() {
  console.log('[NativeBridge] Registering camera bridge (react-native-vision-camera)');

  if (!global.NativeBridge) {
    global.NativeBridge = {};
  }
  global.NativeBridge.camera = {
    Camera,
    useCameraDevice: (position) => {
      console.log(`[NativeBridge] useCameraDevice("${position}") called by mini-app`);
      return useCameraDevice(position);
    },
    useCameraPermission: () => {
      console.log('[NativeBridge] useCameraPermission() called by mini-app');
      const result = useCameraPermission();
      console.log(`[NativeBridge] Permission status: hasPermission=${result.hasPermission}`);
      return result;
    },
    usePhotoOutput: () => {
      console.log('[NativeBridge] usePhotoOutput() called by mini-app');
      return usePhotoOutput();
    },
  };
}