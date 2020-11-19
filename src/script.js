#! /usr/bin/env node

const { deco } = require('@spare/deco')
const { logger } = require('@spare/logger')
const { program } = require('commander')

program
  .option('-r, --release <release>', 'release type', 'patch')
  .option('-d, --directory <directory>', 'directory', './')
  .option('-v, --verbose', 'show info', false)

program.parse(process.argv)
// if (program.release) console.log(program.opts())
if (program.release) logger(deco(program.release));

// console.log(process.cwd())

(async function () {
  await require('..')
    .csprojVersion(program.directory, { release: program.release })
})()