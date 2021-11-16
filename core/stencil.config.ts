import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'core',
  outputTargets: [
    reactOutputTarget({
      includeImportCustomElements: true,
      includePolyfills: false,
      includeDefineCustomElements: false,
      proxiesFile: '../react/src/components.ts',
      customElementsDir: './dist/components',
    }),
    {
      type: 'dist-custom-elements',
      autoDefineCustomElements: true,
    },
    {
      type: 'dist-hydrate-script',
    },
  ],
};
