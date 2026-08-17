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
  if (!global.NativeBridge) {
    global.NativeBridge = {};
  }
  global.NativeBridge.camera = {
    Camera,
    useCameraDevice,
    useCameraPermission,
    usePhotoOutput,
  };
}