'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var says = require('@palett/says');
var deco = require('@spare/deco');
var logger = require('@spare/logger');
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var xml2js = require('xml2js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var semver__default = /*#__PURE__*/_interopDefaultLegacy(semver);
var xml2js__default = /*#__PURE__*/_interopDefaultLegacy(xml2js);

const readFolders = async (base, {
  fullPath,
  prefix,
  ignores
}) => {
  /** @type {Dirent[]} */
  const dirents = await fs.promises.readdir(base, {
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
  const dirents = await fs.promises.readdir(folder, {
    withFileTypes: true
  });
  let files = dirents.filter(file => file.isFile());
  if (prefix) files = files.filter(file => file.name.startsWith(prefix));
  if (suffix) files = files.filter(file => file.name.endsWith(suffix));
  if (ignores) files = files.filter(file => !ignores.includes(file.name));
  return fullPath ? files.map(file => folder + '/' + file.name) : files.map(file => file.name);
};

const parser = new xml2js__default['default'].Parser({
  explicitArray: false
});
const builder = new xml2js__default['default'].Builder();
const csprojVersion = async (dir = process.cwd(), {
  prefix,
  ignores,
  release = 'patch'
} = {}) => {
  const folders = await readFolders(dir, {
    fullPath: true,
    prefix,
    ignores
  });

  for (const folder of folders) {
    const files = await readFiles(folder, {
      fullPath: true,
      suffix: 'csproj'
    });
    if (files === null || files === void 0 ? void 0 : files.length) for (let file of files) {
      var _ros, _jsonData$Project, _ref2;

      const logger$1 = says.says[path__default['default'].basename(file)].asc;
      _ros = says.ros(path__default['default'].basename(file)), says.says['Versioning'](_ros);
      const xmlData = await fs.promises.readFile(file);
      const jsonData = await parser.parseStringPromise(xmlData); // jsonData |> Deco({ vert: 3 }) |> logger

      const propertyGroup = jsonData === null || jsonData === void 0 ? void 0 : (_jsonData$Project = jsonData.Project) === null || _jsonData$Project === void 0 ? void 0 : _jsonData$Project.PropertyGroup;

      for (let key in propertyGroup) if (propertyGroup.hasOwnProperty(key) && (key === null || key === void 0 ? void 0 : key.endsWith('Version'))) {
        var _ref, _Xr$ros$release;

        const prev = propertyGroup[key];
        const curr = semver__default['default'].inc(prev, release);
        _ref = (_Xr$ros$release = logger.Xr()[says.ros(key)](prev)[release](curr), deco.deco(_Xr$ros$release)), logger$1(_ref);
        propertyGroup[key] = curr;
      }

      const currXmlData = builder.buildObject(jsonData);
      await fs.promises.writeFile(file, currXmlData);
      _ref2 = '', console.log(_ref2);
    }
  }
};

exports.csprojVersion = csprojVersion;
