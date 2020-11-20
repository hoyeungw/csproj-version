#! /usr/bin/env node

const { program } = require('commander')
const { logger, decoString, Xr, ros } = require('@spare/logger')
const { csprojVersion } = require('..')

program
  .option('-r, --release <release>', 'release type', 'patch')
  .option('-d, --directory <directory>', 'directory')
  .option('-v, --verbose', 'show info', false)
  .option('-s, --simulate', 'simulate only, do not modify file', false)

program.parse(process.argv)

logger(
  Xr(ros('dotver'))
    .directory(decoString(program.directory ?? process.cwd()))
    .release(program.release),
  '\n'
)
// if (program.release) console.log(program.opts())

csprojVersion(
  program.directory,
  {
    release: program.release,
    simulate: program.simulate,
  }
).then()