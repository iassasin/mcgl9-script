import typescript from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from "rollup-plugin-uglify";

const mini = process.env.MINI === '1';
const watch = process.env.WATCH === '1';

let plugins = [
  resolve(),
  typescript(),
];

if (mini) {
  plugins.push(uglify({
    compress: {
      passes: 3,
    },

    output: {
      max_line_len: 128,
    },
  }));
}

export default {
  input: 'script.ts',
  context: 'this',

  output: {
    file: 'dist/script.js',
    format: 'iife',
    compact: false,
    strict: false,
  },

  watch: {
    exclude: 'node_modules/**',
    clearScreen: false,
  },

  plugins,
};