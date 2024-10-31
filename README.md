<p align="center">
  <img src="./media/dotver-cover.svg" />
</p>

## csproj-version

[![npm version][badge-npm-version]][url-npm]
[![npm download monthly][badge-npm-download-monthly]][url-npm]
[![npm download total][badge-npm-download-total]][url-npm]
[![npm dependents][badge-npm-dependents]][url-github]
[![npm license][badge-npm-license]][url-npm]
[![pp install size][badge-pp-install-size]][url-pp]
[![github commit last][badge-github-last-commit]][url-github]
[![github commit total][badge-github-commit-count]][url-github]

[//]: <> (Shields)
[badge-npm-version]: https://flat.badgen.net/npm/v/csproj-version
[badge-npm-download-monthly]: https://flat.badgen.net/npm/dm/csproj-version
[badge-npm-download-total]:https://flat.badgen.net/npm/dt/csproj-version
[badge-npm-dependents]: https://flat.badgen.net/npm/dependents/csproj-version
[badge-npm-license]: https://flat.badgen.net/npm/license/csproj-version
[badge-pp-install-size]: https://flat.badgen.net/packagephobia/install/csproj-version
[badge-github-last-commit]: https://flat.badgen.net/github/last-commit/hoyeungw/csproj-version
[badge-github-commit-count]: https://flat.badgen.net/github/commits/hoyeungw/csproj-version
[//]: <> (Link)

[url-npm]: https://npmjs.org/package/csproj-version
[url-pp]: https://packagephobia.now.sh/result?p=csproj-version
[url-github]: https://github.com/hoyeungw/csproj-version

### CLI tool to bump semver versioning for .NET solutions

#### Brief

Traverse all *.csproj / *.fsproj / *.vbproj under designated directory, and bump version based on semver rules.

#### Install

```console
# npm
npm install -d csproj-version
# yarn
yarn global add csproj-version
# pnpm
pnpm add -g csproj-version
```

#### Usage

```console
cd DotNetSolutionFolder
dotver
# or
dotver -r minor
dotver -d . -v -r major

Options:
-r --release	release type. default: "patch"
-d --directory	directory. default: "."
-o --omit	omit (regex pattern). default: "test$"
-v --verbose	show info. default: false
-s --simulate	simulate only without modifying file. default: false
```

#### Requirement

node >= 20.0.0

#### Meta

[LICENSE (MIT)](LICENSE)
