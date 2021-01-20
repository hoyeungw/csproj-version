import { promises } from "fs"


export const readFolders = async (base, { fullPath, prefix, ignores }) => {
  /** @type {Dirent[]} */ const dirents = await promises
    .readdir(base, { withFileTypes: true })
  let folders = dirents
    .filter(file => file.isDirectory())
    .filter(folder => !folder.name.startsWith('.'))
  if (prefix) folders = folders.filter(folder => folder.name.startsWith(prefix))
  if (ignores) folders = folders.filter(folder => !ignores.includes(folder.name))
  return fullPath
    ? folders.map(folder => base + '/' + folder.name)
    : folders.map(folder => folder.name)
}

export const readFiles = async (folder, { fullPath, prefix, suffix, ignores }) => {
  /** @type {Dirent[]} */ const dirents = await promises
    .readdir(folder, { withFileTypes: true })
  let files = dirents
    .filter(file => file.isFile())
  if (prefix) files = files.filter(file => file.name.startsWith(prefix))
  if (suffix) files = files.filter(file => file.name.endsWith(suffix))
  if (ignores) files = files.filter(file => !ignores.includes(file.name))
  return fullPath
    ? files.map(file => folder + '/' + file.name)
    : files.map(file => file.name)
}