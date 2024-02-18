import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';
import scss from 'rollup-plugin-scss';
import { PluginPure } from 'rollup-plugin-pure';

const rollupPlugins = [
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
  typescript({ declaration: false }),
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
};

export default [
  {
    ...rollupConfig,
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        extensions: ['.ts', '.tsx', '.mjs', '.js']
      }),
      ...rollupPlugins
    ],
  },
  {
    ...rollupConfig,
    output: [
      {
        file: 'dist/index.web.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.web.mjs',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        extensions: [
          '.web.ts', '.web.tsx', '.web.mjs', '.web.js',
          '.ts', '.tsx', '.mjs', '.js',
        ]
      }),
      scss({ fileName: 'index.web.css' }),
      ...rollupPlugins
    ],
  },
  {
    ...rollupConfig,
    output: [
      {
        file: 'dist/index.server.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.server.mjs',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        extensions: [
          '.server.ts', '.server.tsx', '.server.mjs', '.server.js',
          '.web.ts', '.web.tsx', '.web.mjs', '.web.js',
          '.ts', '.tsx', '.mjs', '.js',
        ]
      }),
      ...rollupPlugins
    ],
  },
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
        extensions: ['.ts', '.tsx', '.mjs', '.js']
      }),
      dts()
    ],
  },
  {
    ...rollupConfig,
    output: [
      {
        file: 'dist/index.web.d.ts',
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
          '.web.ts', '.web.tsx', '.web.mjs', '.web.js',
          '.ts', '.tsx', '.mjs', '.js',
        ]
      }),
      dts()
    ],
  },
];