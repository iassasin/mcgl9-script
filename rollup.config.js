import typescript from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from "rollup-plugin-uglify";

const mini = process.env.MINI === '1';
const veryMini = process.env.MINI === '2';
const watch = process.env.WATCH === '1';
const target = process.env.TARGET || 'script';
const allTargets = target === 'all';

function optional(cond, obj) {
  if (cond) {
    return [obj];
  }

  return [];
}

function createConfig() {
  let plugins = [
    resolve(),
    typescript(),
  ];

  if (mini || veryMini) {
    plugins.push(uglify({
      compress: {
        passes: 3,
      },

      output: {
        max_line_len: veryMini ? undefined : 128,
      },
    }));
  }

  return {
    input: 'script.ts',
    context: 'this',

    watch: {
      exclude: 'node_modules/**',
      clearScreen: false,
    },

    plugins,
  };
}

export default [
  ...optional(allTargets || target === 'script', {
    ...createConfig(),

    input: 'script.ts',

    output: {
      file: 'dist/script.js',
      format: 'iife',
      compact: false,
      strict: false,
    },
  }),

  ...optional(allTargets || target === '3d' , {
    ...createConfig(),

    input: 'mcgl9/3d-export.js',

    output: {
      file: 'dist/3d.js',
      format: 'iife',
      compact: false,
      strict: false,
    },
  }),
];