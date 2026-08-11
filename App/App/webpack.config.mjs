import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Webpack configuration for SuperApp Workspace
 * Multiplexed using `--env app=<name>`
 */
export default (env) => {
  // Determine which mini-app or host we are building (defaults to 'host')
  const appName = env.app || 'host';

  // 1. Shared Dependencies Contract
  // Both Host and Remotes MUST agree on these versions. 
  // 'eager: true' on the host ensures React is loaded immediately before any remote needs it.
  const sharedDependencies = {
    react: { singleton: true, eager: appName === 'host', requiredVersion: '18.2.0' },
    'react-native': { singleton: true, eager: appName === 'host', requiredVersion: '0.74.0' },
    // You will eventually add your Core SDK / Shared UI toolkit here
  };

  // 2. Base Configuration (Applies to all builds)
  const baseConfig = {
    context: __dirname,
    resolve: {
      ...Repack.getResolveOptions(env.platform),
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'index.js'),
            path.resolve(__dirname, 'node_modules/react-native'), // Often requires transpilation
          ],
          use: {
            loader: '@callstack/repack/babel-swc-loader',
            options: {}, // Uses Re.Pack's default SWC settings for React Native
          },
        },
        ...Repack.getAssetTransformRules(),
      ],
    },
  };

  // ==========================================================
  // 3. HOST APP CONFIGURATION
  // ==========================================================
  if (appName === 'host') {
    return Repack.defineWebpackConfig({
      ...baseConfig,
      entry: './index.js', // Standard RN entry point which should import src/host-shell/App.tsx
      plugins: [
        new Repack.RepackPlugin({
          context: __dirname,
          mode: env.mode,
          platform: env.platform,
        }),
        new Repack.plugins.ModuleFederationPlugin({
          name: 'host_app',
          remotes: {
            // '@dynamic' tells the Host that the URL for this container 
            // will be resolved at runtime using Repack's ScriptManager
            contract_app: 'contract_app@dynamic',
          },
          shared: sharedDependencies,
        }),
      ],
    });
  }

  // ==========================================================
  // 4. CONTRACT MINI-APP CONFIGURATION
  // ==========================================================
  if (appName === 'contract') {
    return Repack.defineWebpackConfig({
      ...baseConfig,
      entry: './src/mini-apps/contract/index.js',
      plugins: [
        new Repack.RepackPlugin({
          context: __dirname,
          mode: env.mode,
          platform: env.platform,
        }),
        new Repack.plugins.ModuleFederationPlugin({
          name: 'contract_app',
          exposes: {
            // The Host will import this exact path to load the mini-app UI
            './App': './src/mini-apps/contract/index.js',
          },
          shared: sharedDependencies,
        }),
      ],
    });
  }

  // Fallback error
  throw new Error(`Unknown app configuration requested: ${appName}. Use --env app=host or --env app=contract.`);
};