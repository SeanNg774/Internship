/**
 * CameraBridge — contract shared between the host app and any mini-app
 * that needs camera access (e.g. AR).
 *
 * Mini-apps NEVER import a camera library directly. They only call
 * `global.NativeBridge.camera.*`. That means:
 *  - The host can swap this mock for a real native implementation later
 *    (react-native-vision-camera, expo-camera, etc.) without touching
 *    any mini-app code.
 *  - Mini-apps stay 100% JS, no native linking required on their side.
 *
 * Every method here mirrors what the REAL implementation's shape will
 * eventually be — same method names, same argument/return shapes,
 * same error cases — so swapping mock -> real is a one-file change.
 */

// ---- Types (JSDoc only, no TS build step needed) --------------------

/**
 * @typedef {Object} PermissionResult
 * @property {'granted'|'denied'|'undetermined'} status
 */

/**
 * @typedef {Object} CapturePhotoResult
 * @property {string} uri        - local file uri (or data uri in mock)
 * @property {number} width
 * @property {number} height
 * @property {number} timestamp
 */

// ---- Mock implementation ---------------------------------------------

function createMockCameraBridge() {
  let permissionStatus = 'undetermined';
  let previewActive = false;
  let captureCount = 0;

  return {
    /** @returns {Promise<PermissionResult>} */
    async requestPermission() {
      // simulate the async native permission dialog
      await delay(400);
      permissionStatus = 'granted';
      return { status: permissionStatus };
    },

    /** @returns {Promise<PermissionResult>} */
    async getPermissionStatus() {
      await delay(50);
      return { status: permissionStatus };
    },

    /** @returns {Promise<void>} */
    async startPreview() {
      if (permissionStatus !== 'granted') {
        throw new Error('CameraBridge: permission not granted. Call requestPermission() first.');
      }
      await delay(200);
      previewActive = true;
    },

    /** @returns {Promise<void>} */
    async stopPreview() {
      await delay(50);
      previewActive = false;
    },

    /** @returns {boolean} */
    isPreviewActive() {
      return previewActive;
    },

    /** @returns {Promise<CapturePhotoResult>} */
    async capturePhoto() {
      if (!previewActive) {
        throw new Error('CameraBridge: preview not active. Call startPreview() first.');
      }
      await delay(300);
      captureCount += 1;
      // 1x1 transparent PNG placeholder so <Image> components don't break
      // if the mini-app tries to render the "captured" photo.
      return {
        uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        width: 1080,
        height: 1920,
        timestamp: Date.now(),
        __mock: true,
        __captureIndex: captureCount,
      };
    },

    /** Diagnostic helper, mock-only — remove when swapping to real bridge */
    __debugState() {
      return { permissionStatus, previewActive, captureCount };
    },
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Call this once, as early as possible in the HOST app's bootstrap
 * (e.g. top of index.js, before App.tsx renders). Mini-apps loaded
 * after this point can safely read global.NativeBridge.camera.
 */
export function registerMockCameraBridge() {
  if (!global.NativeBridge) {
    global.NativeBridge = {};
  }
  global.NativeBridge.camera = createMockCameraBridge();
}