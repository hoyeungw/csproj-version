import { ros, says } from '@palett/says';
import { deco } from '@spare/deco';
import { Xr, decoString } from '@spare/logger';
import { date, time } from '@valjoux/timestamp-pretty';
import { promises } from 'fs';
import { basename } from 'path';
import semver from 'semver';
import xml2js from 'xml2js';

const readFolders = async (base, {
  fullPath,
  prefix,
  omit
}) => {
  /** @type {Dirent[]} */
  const dirents = await promises.readdir(base, {
    withFileTypes: true
  });
  let folders = dirents.filter(file => file.isDirectory()).filter(folder => !folder.name.startsWith('.'));
  if (prefix) folders = folders.filter(({
    name
  }) => name.startsWith(prefix));
  if (omit) folders = folders.filter(({
    name
  }) => !omit.test(name));
  return fullPath ? folders.map(folder => base + '/' + folder.name) : folders.map(folder => folder.name);
};
const readFiles = async (folder, {
  fullPath,
  prefix,
  suffix,
  omit
}) => {
  /** @type {Dirent[]} */
  const dirents = await promises.readdir(folder, {
    withFileTypes: true
  });
  let files = dirents.filter(file => file.isFile());
  if (prefix) files = files.filter(({
    name
  }) => name.startsWith(prefix));
  if (suffix) files = files.filter(({
    name
  }) => name.endsWith(suffix));
  if (omit) files = files.filter(({
    name
  }) => !omit.test(name));
  return fullPath ? files.map(file => folder + '/' + file.name) : files.map(file => file.name);
};

const parser = new xml2js.Parser({
  explicitArray: false
});
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

const csprojVersion = async (dir = process.cwd(), {
  prefix,
  suffix = 'csproj',
  omit,
  release = 'patch',
  simulate = false
} = {}) => {
  const folders = await readFolders(dir, {
    fullPath: true,
    prefix
  });

  for (const folder of folders) {
    if (omit !== null && omit !== void 0 && omit.test(folder)) {
      var _ros, _ref;

      _ros = ros(basename(folder)), says['Skipped'].br(date() + ' ' + time())(_ros);
      _ref = '', console.log(_ref);
      continue;
    }

    let modified = false;
    const files = await readFiles(folder, {
      fullPath: true,
      suffix: suffix
    });

    for (let file of files) {
      var _ros2, _json$Project, _ref3;

      const logger = says[basename(file)].asc;
      _ros2 = ros(basename(file)), says['Version'].br(date() + ' ' + time())(_ros2);
      const json = await parser.parseStringPromise(await promises.readFile(file)); // json |> Deco({ vert: 3 }) |> logger

      const propertyGroup = json === null || json === void 0 ? void 0 : (_json$Project = json.Project) === null || _json$Project === void 0 ? void 0 : _json$Project.PropertyGroup;

      for (let key in propertyGroup) if (propertyGroup.hasOwnProperty(key)) if (key !== null && key !== void 0 && key.endsWith('Version') && (modified = true)) {
        var _ref2, _Xr$decoString$releas;

        const prev = propertyGroup[key],
              curr = semver.inc(prev, release);
        _ref2 = (_Xr$decoString$releas = Xr()[decoString("PropertyGroup." + key)](prev)[release](curr), deco(_Xr$decoString$releas)), logger(_ref2);
        propertyGroup[key] = curr;
      }

      if (modified && !simulate) {
        var _ros3;

        await promises.writeFile(file, builder.buildObject(json));
        _ros3 = ros(basename(file)), says['Modified'].br(date() + ' ' + time())(_ros3);
      }

      _ref3 = '', console.log(_ref3);
    }
  }
};

export { csprojVersion };
