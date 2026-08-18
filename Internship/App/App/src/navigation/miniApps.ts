import React from 'react';
import { Federated } from '@callstack/repack/client';

// Kept in one module so each remote is only ever wrapped in React.lazy()
// once, regardless of how many screens/navigators reference it.
export const ARMiniApp = React.lazy(() => Federated.importModule('ar_app', './App'));
export const RedMarkingMiniApp = React.lazy(() =>
  Federated.importModule('redmarking_app', './App'),
);
