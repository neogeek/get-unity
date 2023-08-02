import { stat, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import fetch from 'node-fetch';

import { JSDOM } from 'jsdom';

export const EDITOR_INSTALLERS_FILE_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '../data/editor-installers.json'
);

export const JSON_TAB_WIDTH = 2;

export const DEFAULT_CACHE_TTL = 3600000;

export const parseVersionsFromUnityArchive = body => {
  const { document } = new JSDOM(body).window;

  return Array.from(document.querySelectorAll('a[href^="unityhub://"]')).reduce(
    (acc, elem) => {
      const link = elem.getAttribute('href');

      if (!link) {
        return acc;
      }

      const [version, hash] = link.replace('unityhub://', '').split('/');

      acc[version] = {
        linux: `https://download.unity3d.com/download_unity/${hash}/LinuxEditorInstaller/Unity.tar.xz`,
        mac: `https://download.unity3d.com/download_unity/${hash}/MacEditorInstaller/Unity-${version}.pkg`,
        macArm64: `https://download.unity3d.com/download_unity/${hash}/MacEditorInstallerArm64/Unity-${version}.pkg`,
        win64: `https://download.unity3d.com/download_unity/${hash}/Windows64EditorInstaller/UnitySetup64-${version}.exe`,
      };

      return acc;
    },
    {}
  );
};

export const updateEditorInstallers = async (
  filePath = EDITOR_INSTALLERS_FILE_PATH,
  ttl = DEFAULT_CACHE_TTL
) => {
  const stats = await stat(filePath);

  const ttlInMilliseconds = ttl * 1000;

  if (new Date(stats.mtime).getTime() + ttlInMilliseconds < Date.now()) {
    const response = await fetch(
      'https://unity3d.com/get-unity/download/archive'
    );

    const data = await response.text();

    const versions = parseVersionsFromUnityArchive(data);

    await writeFile(filePath, JSON.stringify(versions, null, JSON_TAB_WIDTH));
  }
};
