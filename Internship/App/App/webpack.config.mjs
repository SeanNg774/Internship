import * as Repack from '@callstack/repack';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env) => {
  // Extract environment variables safely
  const appName = env.app || 'host';
  const platform = env.platform || 'android';
  const mode = env.mode || 'development';

  // 1. Shared Dependencies Contract
  const sharedDependencies = {
    react: { singleton: true, eager: appName === 'host', strictVersion: false },
    'react-native': { singleton: true, eager: appName === 'host', strictVersion: false },
  };

  // 2. Base Configuration (Only pure Webpack properties here!)
  const baseConfig = {
    context: __dirname,
    mode, 
    resolve: {
      ...Repack.getResolveOptions(platform),
    },
    devServer: {}, 
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: [
            /node_modules(.*[/\\])+react/,
            /node_modules(.*[/\\])+@react-native/,
            /node_modules(.*[/\\])+react-native/, 
            /node_modules(.*[/\\])+@callstack/,
            /index\.js/,
            /App\.tsx/,
            path.resolve(__dirname, './src'),     
          ],
          use: 'babel-loader',
        },
        ...Repack.getAssetTransformRules(),
      ],
    },
  };

  // ==========================================================
  // 3. HOST APP CONFIGURATION
  // ==========================================================
  if (appName === 'host') {
    return {
      ...baseConfig,
      entry: './index.js',
      plugins: [
        new Repack.RepackPlugin({
          context: __dirname,
          mode,
          platform, // 'platform' is safely tucked inside the plugin where it belongs
        }),
        new Repack.plugins.ModuleFederationPlugin({
          name: 'host_app',
          remotes: {
            contract_app: 'contract_app@dynamic',
          },
          shared: sharedDependencies,
        }),
      ],
    };
  }

  // ==========================================================
  // 4. CONTRACT MINI-APP CONFIGURATION
  // ==========================================================
  if (appName === 'contract') {
    return {
      ...baseConfig,
      
      // 1. Explicitly name the entry chunk 'index' so Re.Pack recognizes it
      entry: {
        index: './src/miniapps/contract/index.js', 
      },
      
      // 2. Explicitly tell Webpack it is hosted on port 8082
      output: {
        publicPath: 'http://localhost:8082/', 
      },
      
      plugins: [
        new Repack.RepackPlugin({
          context: __dirname,
          mode,
          platform,
        }),
        new Repack.plugins.ModuleFederationPlugin({
          name: 'contract_app',
          filename: 'contract_app.container.bundle',
          exposes: {
            './App': './src/miniapps/contract/index.js',
          },
          shared: sharedDependencies,
        }),
      ],
    };
  }

  // Fallback error
  throw new Error(`Unknown app configuration requested: ${appName}. Use --env app=host or --env app=contract.`);
};