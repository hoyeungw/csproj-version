import { ros, says }              from '@palett/says'
import { deco }                   from '@spare/deco'
import { decoString, Xr }         from '@spare/logger'
import { date, time }             from '@valjoux/timestamp-pretty'
import { promises }               from 'fs'
import { basename as base }       from 'path'
import semver                     from 'semver'
import xml2js                     from 'xml2js'
import { readFiles, readFolders } from './reader'


const parser = new xml2js.Parser({ explicitArray: false })
const builder = new xml2js.Builder()

/**
 *
 * @param {string} [dir]
 * @param {string} [prefix]
 * @param {string} [suffix]
 * @param {RegExp} [omit]
 * @param {string} [release]
 * @param {boolean} [simulate]
 * @returns {Promise<void>}
 */
export const csprojVersion = async (
  dir = process.cwd(),
  {
    prefix,
    suffix = 'csproj',
    omit,
    release = 'patch',
    simulate = false
  } = {}
) => {
  const folders = await readFolders(dir, { fullPath: true, prefix })
  for (const folder of folders) {
    if (omit?.test(folder)) {
      ros(base(folder)) |> says['Skipped'].br(date() + ' ' + time())
      continue
    }
    let modified = false
    const files = await readFiles(folder, { fullPath: true, suffix: suffix })
    for (let file of files) {
      const logger = says[base(file)].asc
      ros(base(file)) |> says['Versioning'].br(date() + ' ' + time())
      const json = await parser.parseStringPromise(await promises.readFile(file)) // json |> Deco({ vert: 3 }) |> logger
      const propertyGroup = json?.Project?.PropertyGroup
      for (let key in propertyGroup) if (propertyGroup.hasOwnProperty(key))
        if (key?.endsWith('Version') && (modified = true)) {
          const
            prev = propertyGroup[key],
            curr = semver.inc(prev, release)
          Xr()[decoString("PropertyGroup." + key)](prev)[release](curr) |> deco |> logger
          propertyGroup[key] = curr
        }
      if (modified && !simulate) {
        await promises.writeFile(file, builder.buildObject(json))
        ros(base(file)) |> says['Modified'].br(date() + ' ' + time())
      }
      '' |> console.log
    }
  }
}