# ![get-unity](logo.png)

> 🕹 Command line tool for getting the download URL for the latest or specific version of Unity.

[![NPM Version](http://img.shields.io/npm/v/get-unity.svg?style=flat)](https://www.npmjs.org/package/get-unity)
[![Build Status](https://travis-ci.com/neogeek/get-unity.svg?branch=master)](https://travis-ci.com/neogeek/get-unity)

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

### Exporting URL to an enviroment variable.

```bash
$ UNITY_URL=$(get-unity 2019.2.x)
$ echo $UNITY_URL
```

## API

### `getUnityUrls`

```javascript
const { getUnityUrls } = require("get-unity");

getUnityUrls("2019").then(urls => console.log(urls));
```
