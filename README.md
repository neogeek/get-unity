# ![get-unity](logo.png)

> 🕹 Command line tool for getting the download URL for the latest or specific version of Unity.

[![NPM Version](http://img.shields.io/npm/v/get-unity.svg?style=flat)](https://www.npmjs.org/package/get-unity)
[![Tests](https://github.com/neogeek/get-unity/actions/workflows/test.workflow.yml/badge.svg)](https://github.com/neogeek/get-unity/actions/workflows/test.workflow.yml)
[![Build status](https://ci.appveyor.com/api/projects/status/2k76ian4w73uk3af?svg=true)](https://ci.appveyor.com/project/neogeek/get-unity)

## Install

```bash
$ npm install -g get-unity
```

## Usage

### Get the download URL of the latest major release of Unity.

```bash
$ get-unity
```

### Get the download URL of the latest minor release of Unity.

```bash
$ get-unity 2019.x
```

### Get the download URL of the latest patch release of Unity.

```bash
$ get-unity 2019.2.x
```

### Get the download URL of the version found in ProjectSettings/ProjectVersion.txt

```bash
$ get-unity --file=ProjectSettings/ProjectVersion.txt
```

### Exporting URL to an enviroment variable.

```bash
$ UNITY_URL=$(get-unity --file=ProjectSettings/ProjectVersion.txt)
$ echo $UNITY_URL
```

## Help

```bash
  Command line tool for getting the download URL for the latest or specific version of Unity.

  Usage
    $ get-unity <version> [options]

  Options
  --file, -f       Search file for Unity version number.
  --force, -r      Force update to local cache of editor versions.
  --offline, -o    Prevent request to update local cache of editor versions.
  --help, -h       Display this help message.
  --version, -v    Display the current installed version.
```

## API

### `getUnityUrls(string filter [, string filePath])`

```javascript
const { getUnityUrls } = require('get-unity');

getUnityUrls('2019', './data/editor-installers.json').then(urls =>
  console.log(urls)
);
```

Output:

```json
{
  "linux": "https://download.unity3d.com/download_unity/5f859a4cfee5/LinuxEditorInstaller/Unity.tar.xz",
  "mac": "https://download.unity3d.com/download_unity/5f859a4cfee5/MacEditorInstaller/Unity-2019.2.11f1.pkg",
  "win64": "https://download.unity3d.com/download_unity/5f859a4cfee5/Windows64EditorInstaller/UnitySetup64-2019.2.11f1.exe"
}
```

### `parseVersionFromString(string contents)`

```javascript
const { parsers } = require('get-unity');

console.log(
  parsers.parseVersionFromString(`m_EditorVersion: 2019.2.9f1
m_EditorVersionWithRevision: 2019.2.9f1 (ebce4d76e6e8)`)
);
```

Output:

```
2019.2.9f1
```

### `updateEditorInstallers([string filePath, int ttl])`

```javascript
const { updateEditorInstallers } = require('get-unity');

updateEditorInstallers('./data/editor-installers.json', 3600000).then(() =>
  console.log('Done')
);
```
