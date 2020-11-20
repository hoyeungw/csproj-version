import { ros, says }              from '@palett/says'
import { deco }                   from '@spare/deco'
import { Xr }                     from '@spare/logger'
import { date, time }             from '@valjoux/timestamp-pretty'
import { promises }               from 'fs'
import path                       from 'path'
import semver                     from 'semver'
import xml2js                     from 'xml2js'
import { readFiles, readFolders } from './reader'

const parser = new xml2js.Parser({ explicitArray: false })
const builder = new xml2js.Builder()

export const csprojVersion = async (
  dir = process.cwd(),
  {
    prefix,
    ignores,
    release = 'patch',
    simulate = false
  } = {}
) => {
  const folders = await readFolders(dir, { fullPath: true, prefix, ignores })
  for (const folder of folders) {
    const files = await readFiles(folder, { fullPath: true, suffix: 'csproj' })
    if (files?.length)
      for (let file of files) {
        const logger = says[path.basename(file)].asc
        ros(path.basename(file)) |> says['Versioning'].br(date() + ' ' + time())
        const xmlData = await promises.readFile(file)
        const jsonData = await parser.parseStringPromise(xmlData)
        // jsonData |> Deco({ vert: 3 }) |> logger
        const propertyGroup = jsonData?.Project?.PropertyGroup
        for (let key in propertyGroup)
          if (propertyGroup.hasOwnProperty(key) && key?.endsWith('Version')) {
            const prev = propertyGroup[key]
            const curr = semver.inc(prev, release)
            Xr()[ros(key)](prev)[release](curr) |> deco |> logger
            propertyGroup[key] = curr
          }
        const currXmlData = builder.buildObject(jsonData)
        if (!simulate) await promises.writeFile(file, currXmlData)
        '' |> console.log
      }
  }
}