#!/usr/bin/env node

const os = require('os');
const {readFileSync} = require('fs');

const chalk = require('chalk');
const meow = require('meow');

const updateNotifier = require('update-notifier');

const pkg = require('../package.json');

const editorInstallersUpdate = require('../lib/editor-installers-update');
const getUnityUrls = require('../lib/get-unity-urls');
const {parseVersionFromString} = require('../lib/parsers');

const cli = meow(
    `
      Usage
        $ get-unity <version> [options]

      Options
      ${chalk.yellow('--file, -f')}       Search file for Unity version number.
      ${chalk.yellow('--offline, -o')}    Prevent request to update local cache of versions.
      ${chalk.yellow('--help, -h')}       Display this help message.
      ${chalk.yellow('--version, -v')}    Display the current installed version.
  `,
    {
        'flags': {
            'file': {
                'alias': 'f',
                'type': 'string'
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

        process.exit(1);

    }

}

if (cli.flags.offline) {

    getUnityUrls(cli.input[0]).then(urls =>
        process.stdout.write(`${urls[osKeyMap[os.type()]]}`));

} else {

    editorInstallersUpdate()
        .catch(({message}) => {

            process.stderr.write(`${chalk.red('Error:')} ${message}`);

        })
        .then(() => getUnityUrls(cli.input[0]))
        .then(urls => process.stdout.write(`${urls[osKeyMap[os.type()]]}`));

}
