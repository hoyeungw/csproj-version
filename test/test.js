import { csprojVersion } from '../index'

// cd test/assets
// node ../../script.js -s
export const test = async () => {
  await csprojVersion(
    './test/assets',
    {
      omit: RegExp('test$', 'i')
    }
  )
}

test()