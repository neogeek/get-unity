#!/usr/bin/env node

const os = require('os');
const {readFileSync} = require('fs');
const {join} = require('path');

const chalk = require('chalk');
const meow = require('meow');

const updateNotifier = require('update-notifier');

const pkg = require('../package.json');

const updateEditorInstallers = require('../lib/update-editor-installers');
const getUnityUrls = require('../lib/get-unity-urls');
const {parseVersionFromString} = require('../lib/parsers');

const cli = meow(
    `
      Usage
        $ get-unity <version> [options]

      Options
      ${chalk.yellow('--file, -f')}       Search file for Unity version number.
      ${chalk.yellow('--force, -r')}      Force update to local cache of editor versions.
      ${chalk.yellow('--offline, -o')}    Prevent request to update local cache of editor versions.
      ${chalk.yellow('--help, -h')}       Display this help message.
      ${chalk.yellow('--version, -v')}    Display the current installed version.
  `,
    {
        'flags': {
            'file': {
                'alias': 'f',
                'type': 'string'
            },
            'force': {
                'alias': 'r',
                'default': false,
                'type': 'boolean'
            },
            'help': {
                'alias': 'h',
                'default': false,
                'type': 'boolean'
            },
            'offline': {
                'alias': 'o',
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
    'Linux': 'linux',
    'Windows_NT': 'win64'
};

const EDITOR_INSTALLERS_FILE_PATH = join(
    __dirname,
    '../data/editor-installers.json'
);

const DEFAULT_CACHE_TTL = 3600000;

updateNotifier({pkg}).notify();

if (cli.flags.file) {

    try {

        cli.input[0] = parseVersionFromString(readFileSync(
            cli.flags.file,
            'utf8'
        ));

    } catch ({message}) {

        process.stderr.write(`${chalk.red('Error:')} ${message}`);

        process.exit(1);

    }

}

if (cli.flags.offline) {

    getUnityUrls(
        cli.input[0],
        EDITOR_INSTALLERS_FILE_PATH
    ).then(urls =>
        process.stdout.write(`${urls[osKeyMap[os.type()]]}`));

} else {

    updateEditorInstallers(
        EDITOR_INSTALLERS_FILE_PATH,
        cli.flags.force
            ? 0
            : DEFAULT_CACHE_TTL
    )
        .catch(({message}) => {

            process.stderr.write(`${chalk.red('Error:')} ${message}`);

        })
        .then(() => getUnityUrls(
            cli.input[0],
            EDITOR_INSTALLERS_FILE_PATH
        ))
        .then(urls => process.stdout.write(`${urls[osKeyMap[os.type()]]}`));

}
