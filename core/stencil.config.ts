import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'core',
  outputTargets: [
    reactOutputTarget({
      includeImportCustomElements: true,
      includeDefineCustomElements: false,
      customElementsDir: './dist/components',
      proxiesFile: '../react/src/components.ts',
    }),
    {
      type: 'dist-custom-elements',
      // autoDefineCustomElements: true,
    },
    {
      type: 'dist-hydrate-script',
    },
  ],
};
