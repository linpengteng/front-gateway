import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import copy from 'rollup-plugin-copy'


/**
 * Rollup Configuration
 */
export default defineConfig([
  {
    input: 'src/caller.ts',
    output: [
      {
        dir: 'dist',
        name: 'NetCaller',
        format: 'umd',
        exports: 'auto',
        sourcemap: false,
        entryFileNames: 'net-gateway-[name].js'
      }
    ],
    plugins: [
      typescript({ sourceMap: false }),
      terser()
    ]
  },

  {
    input: 'src/worker.ts',
    output: [
      {
        dir: 'dist',
        format: 'iife',
        sourcemap: false,
        entryFileNames: 'net-gateway-[name].js'
      }
    ],
    plugins: [
      typescript({ sourceMap: false }),
      terser(),
      copy({
        targets: [{
          dest: ['dist'],
          src: ['src/config.ts'],
          rename: 'net-gateway-config.js'
        }],
        expandDirectories: false
      })
    ]
  },

  {
    input: 'src/window.ts',
    output: [
      {
        dir: 'dist',
        format: 'iife',
        sourcemap: false,
        entryFileNames: 'net-gateway-[name].js'
      }
    ],
    plugins: [
      typescript({ sourceMap: false }),
      terser()
    ]
  }
])
