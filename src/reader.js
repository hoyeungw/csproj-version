import { promises } from "fs"


export const readFolders = async (base, {fullPath, prefix, omit}) => {
  /** @type {Dirent[]} */ const dirents = await promises.readdir(base, {withFileTypes: true})
  let folders = dirents
    .filter(file => file.isDirectory())
    .filter(folder => !folder.name.startsWith('.'))
  if (prefix) folders = folders.filter(({name}) => name.startsWith(prefix))
  if (omit) folders = folders.filter(({name}) => !omit.test(name))
  return fullPath
    ? folders.map(folder => base + '/' + folder.name)
    : folders.map(folder => folder.name)
}

export const readFiles = async (folder, {fullPath, prefix, suffix, omit}) => {
  /** @type {Dirent[]} */ const dirents = await promises.readdir(folder, {withFileTypes: true})
  let files = dirents.filter(file => file.isFile())
  if (prefix) files = files.filter(({name}) => name.startsWith(prefix))
  if (suffix) files = files.filter(({name}) => name.endsWith(suffix))
  if (omit) files = files.filter(({name}) => !omit.test(name))
  return fullPath
    ? files.map(file => folder + '/' + file.name)
    : files.map(file => file.name)
}