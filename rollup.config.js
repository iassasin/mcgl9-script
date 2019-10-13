// не работает const enum:
// import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from "rollup-plugin-uglify";

const mini = process.env.MINI === '1';

let plugins = [
  // typescript(),
  resolve(),
];

if (mini) {
  plugins.push(uglify());
}

export default {
  input: 'tmpDist/script.js',
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