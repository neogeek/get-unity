#!/usr/bin/env node

const os = require('os');

const getUnityUrls = require('../lib/get-unity-urls');

const osKeyMap = {
    'Darwin': 'mac',
    'Windows_NT': 'win64'
};

const PROCESS_CMD_LINE_ARGS_LENGTH = 2;

const requestedVersion = process.argv.slice(PROCESS_CMD_LINE_ARGS_LENGTH).pop();

getUnityUrls(requestedVersion).then(urls =>
    process.stdout.write(`${urls[osKeyMap[os.type()]]}`));
