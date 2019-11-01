#!/usr/bin/env node

const os = require('os');
const {readFileSync} = require('fs');

const chalk = require('chalk');
const meow = require('meow');

const updateNotifier = require('update-notifier');

const pkg = require('../package.json');

const getUnityUrls = require('../lib/get-unity-urls');
const {parseVersionFromString} = require('../lib/parsers');

const cli = meow(
    `
      Usage
        $ get-unity <version> [options]

      Options
      ${chalk.yellow('--file, -f')}     Search file for Unity version number.
      ${chalk.yellow('--help, -h')}     Display this help message.
      ${chalk.yellow('--version, -v')}  Display the current installed version.
  `,
    {
        'flags': {
            'file': {
                'alias': 'f',
                'default': false,
                'type': 'string'
            },
            'help': {
                'alias': 'h',
                'default': false,
                'type': 'boolean'
            },
            'version': {
                'alias': 'v',
                'default': false,
                'type': 'boolean'
            }
        }
    }
);

const osKeyMap = {
    'Darwin': 'mac',
    'Windows_NT': 'win64'
};

updateNotifier({pkg}).notify();

if (cli.flags.file) {

    try {

        cli.input[0] = parseVersionFromString(readFileSync(
            cli.flags.file,
            'utf8'
        ));

    } catch ({message}) {

        process.stderr.write(`${chalk.red('Error:')} ${message}`);

        process.exit();

    }

}

getUnityUrls(cli.input[0]).then(urls =>
    process.stdout.write(`${urls[osKeyMap[os.type()]]}`));
