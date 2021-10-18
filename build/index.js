import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { resolve } from 'path'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: resolve('src', 'index.ts'),
    output: [
      { format: 'esm', file: resolve('dist', 'index.esm.js') },
      { format: 'cjs', file: resolve('dist', 'index.cjs.js') },
    ],
    plugins: [
      typescript(),
      commonjs(),
      nodeResolve(),
    ]
  },
  {
    input: resolve('src', 'index.ts'),
    output: [
      { format: 'esm', file: resolve('dist', 'index.d.ts') },
    ],
    plugins: [dts()],
  },
]