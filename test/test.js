import { csprojVersion } from '../index.js'

// cd test/assets
// node ../../script.js -s
export const test = async () => {
  await csprojVersion(
    './assets',
    {
      omit: RegExp('test$', 'i')
    }
  )
}

test()