#!/usr/bin/env node

const os = require('os');

const chalk = require('chalk');
const meow = require('meow');

const getUnityUrls = require('../lib/get-unity-urls');

const cli = meow(
    `
      Usage
        $ get-unity <version> [options]

      Options
      ${chalk.yellow('--help, -h')}     Display this help message.
      ${chalk.yellow('--version, -v')}  Display the current installed version.
  `,
    {
        'flags': {
            'autoHelp': true,
            'autoVersion': true
        }
    }
);

const osKeyMap = {
    'Darwin': 'mac',
    'Windows_NT': 'win64'
};

getUnityUrls(cli.input[0]).then(urls =>
    process.stdout.write(`${urls[osKeyMap[os.type()]]}`));
