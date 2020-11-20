import { says, ros } from '@palett/says';
import { deco } from '@spare/deco';
import { Xr } from '@spare/logger';
import { date, time } from '@valjoux/timestamp-pretty';
import { promises } from 'fs';
import path from 'path';
import semver from 'semver';
import xml2js from 'xml2js';

const readFolders = async (base, {
  fullPath,
  prefix,
  ignores
}) => {
  /** @type {Dirent[]} */
  const dirents = await promises.readdir(base, {
    withFileTypes: true
  });
  let folders = dirents.filter(file => file.isDirectory()).filter(folder => !folder.name.startsWith('.'));
  if (prefix) folders = folders.filter(folder => folder.name.startsWith(prefix));
  if (ignores) folders = folders.filter(folder => !ignores.includes(folder.name));
  return fullPath ? folders.map(folder => base + '/' + folder.name) : folders.map(folder => folder.name);
};
const readFiles = async (folder, {
  fullPath,
  prefix,
  suffix,
  ignores
}) => {
  /** @type {Dirent[]} */
  const dirents = await promises.readdir(folder, {
    withFileTypes: true
  });
  let files = dirents.filter(file => file.isFile());
  if (prefix) files = files.filter(file => file.name.startsWith(prefix));
  if (suffix) files = files.filter(file => file.name.endsWith(suffix));
  if (ignores) files = files.filter(file => !ignores.includes(file.name));
  return fullPath ? files.map(file => folder + '/' + file.name) : files.map(file => file.name);
};

const parser = new xml2js.Parser({
  explicitArray: false
});
const builder = new xml2js.Builder();
const csprojVersion = async (dir = process.cwd(), {
  prefix,
  ignores,
  release = 'patch',
  simulate = false
} = {}) => {
  const folders = await readFolders(dir, {
    fullPath: true,
    prefix,
    ignores
  });

  for (const folder of folders) {
    let modified = false;
    const files = await readFiles(folder, {
      fullPath: true,
      suffix: 'csproj'
    });
    if (files === null || files === void 0 ? void 0 : files.length) for (let file of files) {
      var _ros, _jsonData$Project, _ref2;

      const logger = says[path.basename(file)].asc;
      _ros = ros(path.basename(file)), says['Versioning'].br(date() + ' ' + time())(_ros);
      const xmlData = await promises.readFile(file);
      const jsonData = await parser.parseStringPromise(xmlData); // jsonData |> Deco({ vert: 3 }) |> logger

      const propertyGroup = jsonData === null || jsonData === void 0 ? void 0 : (_jsonData$Project = jsonData.Project) === null || _jsonData$Project === void 0 ? void 0 : _jsonData$Project.PropertyGroup;

      for (let key in propertyGroup) if (propertyGroup.hasOwnProperty(key) && (key === null || key === void 0 ? void 0 : key.endsWith('Version')) && (modified = true)) {
        var _ref, _Xr$ros$release;

        const prev = propertyGroup[key];
        const curr = semver.inc(prev, release);
        _ref = (_Xr$ros$release = Xr()[ros(key)](prev)[release](curr), deco(_Xr$ros$release)), logger(_ref);
        propertyGroup[key] = curr;
      }

      if (modified && !simulate) {
        var _ros2;

        const currXmlData = builder.buildObject(jsonData);
        await promises.writeFile(file, currXmlData);
        _ros2 = ros(path.basename(file)), says['Modified'].br(date() + ' ' + time())(_ros2);
      }

      _ref2 = '', console.log(_ref2);
    }
  }
};

export { csprojVersion };
