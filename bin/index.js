#!/usr/bin/env node

import os from 'os';

import chalk from 'chalk';

import meow from 'meow';

import { readPackageUp } from 'read-pkg-up';

import updateNotifier from 'update-notifier';

import {
  EDITOR_INSTALLERS_FILE_PATH,
  updateEditorInstallers,
} from '../lib/update-editor-installers.js';
import { getUnityUrls } from '../lib/get-unity-urls.js';
import { parseVersionFromString } from '../lib/parsers.js';

const cli = meow(
  `
      Usage
        $ get-unity <version> [options]

      Options
      ${chalk.yellow('--file, -f')}       Search file for Unity version number.
      ${chalk.yellow(
        '--force, -r'
      )}      Force update to local cache of editor versions.
      ${chalk.yellow(
        '--offline, -o'
      )}    Prevent request to update local cache of editor versions.
      ${chalk.yellow('--help, -h')}       Display this help message.
      ${chalk.yellow('--version, -v')}    Display the current installed version.
  `,
  {
    flags: {
      file: {
        alias: 'f',
        type: 'string',
      },
      force: {
        alias: 'r',
        default: false,
        type: 'boolean',
      },
      help: {
        alias: 'h',
        default: false,
        type: 'boolean',
      },
      offline: {
        alias: 'o',
        default: false,
        type: 'boolean',
      },
      version: {
        alias: 'v',
        default: false,
        type: 'boolean',
      },
    },
    importMeta: import.meta,
  }
);

const osKeyMap = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'win64',
};

const DEFAULT_CACHE_TTL = 3600000;

updateNotifier({ pkg: (await readPackageUp()).packageJson }).notify();

if (cli.flags.file) {
  try {
    cli.input[0] = parseVersionFromString(readFileSync(cli.flags.file, 'utf8'));
  } catch ({ message }) {
    process.stderr.write(`${chalk.red('Error:')} ${message}`);

    process.exit(1);
  }
}

if (cli.flags.offline) {
  const urls = await getUnityUrls(cli.input[0], EDITOR_INSTALLERS_FILE_PATH);

  process.stdout.write(`${urls[osKeyMap[os.type()]]}`);
} else {
  try {
    await updateEditorInstallers(
      EDITOR_INSTALLERS_FILE_PATH,
      cli.flags.force ? 0 : DEFAULT_CACHE_TTL
    );

    const urls = await getUnityUrls(cli.input[0], EDITOR_INSTALLERS_FILE_PATH);

    process.stdout.write(`${urls[osKeyMap[os.type()]]}`);
  } catch (error) {
    process.stderr.write(`${chalk.red('Error:')} ${error.message}`);
  }
}
