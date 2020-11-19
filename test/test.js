import { csprojVersion } from '../index'

export const test = async () => {
  await csprojVersion('./test/assets')
}

test()