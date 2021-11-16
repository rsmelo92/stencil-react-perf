import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'core',
  outputTargets: [
    {
      type: 'dist-custom-elements',
      autoDefineCustomElements: true,
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-hydrate-script',
    },
    reactOutputTarget({
      proxiesFile: '../react/src/components.ts',
      componentCorePackage: './dist/components',
      includePolyfills: false,
      includeDefineCustomElements: false,
      includeImportCustomElements: true,
      loaderDir: '../../core/loader'
    }),
  ],
};
