#! /usr/bin/env node

import { program }                     from 'commander'
import { decoString, logger, ros, xr } from '@spare/logger'
import { csprojVersion }               from '../dist/index.js'

program
  .option('-r, --release <release>', 'release type', 'patch')
  .option('-d, --directory <directory>', 'directory')
  .option('-o, --omit <omit>', 'omit (regex pattern)', 'test$')
  .option('-v, --verbose', 'show info', false)
  .option('-s, --simulate', 'simulate only, do not modify file', false)

await program.parseAsync(process.argv)
const opts = program.opts()
logger(
  xr(ros('dotver'))
    .directory(decoString(opts.directory ?? process.cwd()))
    .release(opts.release)
    .omit(opts.omit),
  '\n'
)
// if (program.release) console.log(program.opts())
for (const suffix of [ 'csproj', 'fsproj', 'vbproj' ]) {
  await csprojVersion(
    opts.directory,
    {
      suffix: suffix,
      release: opts.release,
      simulate: opts.simulate,
      omit: RegExp(opts.omit, 'i')
    }
  )
}