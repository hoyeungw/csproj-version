import { fileInfo } from 'rollup-plugin-fileinfo'
import json         from '@rollup/plugin-json'
import { readFile } from 'fs/promises'
import { resolve }  from 'node:path'

const BASE = process.cwd()
console.info('Executing', BASE)

const { dependencies } = JSON.parse(await readFile(resolve(BASE, 'package.json'), 'utf8'))
console.info('External', dependencies)

const task = {
  input: resolve(BASE, 'index.js'),
  output: {
    file: resolve(BASE, 'dist', 'index.js'),
    format: 'esm'
  },
  external: Object.keys(dependencies ?? {}),
  plugins: [
    json(),
    fileInfo()
  ]
}

export default task