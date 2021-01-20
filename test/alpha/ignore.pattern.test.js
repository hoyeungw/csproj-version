import { says } from '@palett/says'

const ignorePattern = "test$"

const candidates = [
  "alpha",
  "Beta.Test",
  "gamma",
  "Test.Delta"
]

const test = () => {
  let regex = RegExp(ignorePattern, "gi")
  for (let candidate of candidates) {
    regex.test(candidate) |> says[candidate]
  }
}

test()