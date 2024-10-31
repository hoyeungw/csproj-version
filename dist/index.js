import { says, ros } from '@spare/says';
import { deco } from '@spare/deco';
import { Xr, decoString } from '@spare/logger';
import { date, time } from '@valjoux/timestamp-pretty';
import { promises } from 'fs';
import { basename } from 'path';
import semver from 'semver';
import xml2js from 'xml2js';

const readFolders = async (base, {fullPath, prefix, omit}) => {
  /** @type {Dirent[]} */ const dirents = await promises.readdir(base, {withFileTypes: true});
  let folders = dirents
    .filter(file => file.isDirectory())
    .filter(folder => !folder.name.startsWith('.'));
  if (prefix) folders = folders.filter(({name}) => name.startsWith(prefix));
  if (omit) folders = folders.filter(({name}) => !omit.test(name));
  return fullPath
    ? folders.map(folder => base + '/' + folder.name)
    : folders.map(folder => folder.name)
};

const readFiles = async (folder, {fullPath, prefix, suffix, omit}) => {
  /** @type {Dirent[]} */ const dirents = await promises.readdir(folder, {withFileTypes: true});
  let files = dirents.filter(file => file.isFile());
  if (prefix) files = files.filter(({name}) => name.startsWith(prefix));
  if (suffix) files = files.filter(({name}) => name.endsWith(suffix));
  if (omit) files = files.filter(({name}) => !omit.test(name));
  return fullPath
    ? files.map(file => folder + '/' + file.name)
    : files.map(file => file.name)
};

const parser = new xml2js.Parser({ explicitArray: false });
const builder = new xml2js.Builder();

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
const csprojVersion = async (
  dir = process.cwd(),
  {
    prefix,
    suffix = 'csproj',
    omit,
    release = 'patch',
    simulate = false
  } = {}
) => {
  const folders = await readFolders(dir, { fullPath: true, prefix });
  for (const folder of folders) {
    if (omit?.test(folder)) {
      says['Skipped'].br(date() + ' ' + time())(ros(basename(folder)));
      console.log('');
      continue
    }
    let modified = false;
    const files = await readFiles(folder, { fullPath: true, suffix: suffix });
    for (let file of files) {
      const logger = says[basename(file)].asc;
      says['Version'].br(date() + ' ' + time())(ros(basename(file)));
      const json = await parser.parseStringPromise(await promises.readFile(file)); // json |> Deco({ vert: 3 }) |> logger
      const propertyGroup = json?.Project?.PropertyGroup;
      for (let key in propertyGroup) if (propertyGroup.hasOwnProperty(key))
        if (key?.endsWith('Version') && (modified = true)) {
          const
            prev = propertyGroup[key],
            curr = semver.inc(prev, release);
          logger(deco(Xr()[decoString('PropertyGroup.' + key)](prev)[release](curr)));
          propertyGroup[key] = curr;
        }
      if (modified && !simulate) {
        await promises.writeFile(file, builder.buildObject(json));
        says['Modified'].br(date() + ' ' + time())(ros(basename(file)));
      }
      console.log('');
    }
  }
};

export { csprojVersion };
