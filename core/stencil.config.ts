import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'core',
  outputTargets: [
    reactOutputTarget({
      proxiesFile: '../react/src/components.ts',
      includeDefineCustomElements: true,
      loaderDir: '../../core/loader'
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-hydrate-script',
    },
  ],
};
