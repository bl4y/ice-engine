import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

export default {
  input: 'index.ts',
  output: [
    { file: pkg.main, format: 'umd', name: pkg.name, sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true }
  ],
  external: [],
  treeshake: true,
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
}
