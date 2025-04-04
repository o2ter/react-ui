import _ from 'lodash';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';
import scss from 'rollup-plugin-scss';
import { PluginPure } from 'rollup-plugin-pure';

const rollupPlugins = (exts) => [
  PluginPure({
    functions: [
      'createComponent',
      'createMemoComponent',
      'StyleSheet.create',
      'React.forwardRef',
      'React.createContext',
      'Animated.createAnimatedComponent',
    ],
  }),
  typescript({
    declaration: false,
    moduleSuffixes: exts,
   }),
  babel({
    babelrc: false,
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
  }),
  commonjs({
    transformMixedEsModules: true,
  }),
  json(),
];

const rollupConfig = {
  input: 'src/index',
  external: [
    /node_modules/,
    /^react$/,
    /^react-native$/,
  ],
  makeAbsoluteExternalsRelative: true,
};

const moduleSuffixes = {
  '.server': ['.server', '.web', ''],
  '.web': ['.web', ''],
  '': [''],
};

export default [
  ..._.map(moduleSuffixes, (exts, suffix) => ({
    ...rollupConfig,
    output: [
      {
        file: `dist/index${suffix}.js`,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: `dist/index${suffix}.mjs`,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: _.compact([
      resolve({
        extensions: [
          ...exts.flatMap(x => [`${x}.tsx`, `${x}.jsx`]),
          ...exts.flatMap(x => [`${x}.ts`, `${x}.mjs`, `${x}.js`]),
        ]
      }),
      suffix === '.web' && scss({ fileName: 'index.web.css' }),
      ...rollupPlugins(exts),
    ]),
  })),
  {
    ...rollupConfig,
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [
      resolve({
        extensions: ['.tsx', '.jsx', '.ts', '.mjs', '.js']
      }),
      dts()
    ],
  },
  ..._.map(moduleSuffixes, (exts, suffix) => ({
    ...rollupConfig,
    output: [
      {
        file: `dist/index${suffix}.d.ts`,
        format: 'es',
      },
    ],
    external: [
      /\.css$/,
      /\.scss$/,
      /\.sass$/,
      ...rollupConfig.external,
    ],
    plugins: [
      resolve({
        extensions: [
          ...exts.flatMap(x => [`${x}.tsx`, `${x}.jsx`]),
          ...exts.flatMap(x => [`${x}.ts`, `${x}.mjs`, `${x}.js`]),
        ]
      }),
      dts({
        compilerOptions: {
          moduleSuffixes: exts,
        }
      }),
    ],
  })),
];