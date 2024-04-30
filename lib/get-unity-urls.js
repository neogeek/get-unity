import { readFile } from 'node:fs/promises';

import { EDITOR_INSTALLERS_FILE_PATH } from './update-editor-installers.js';

export const getUnityUrls = async (
  filter = '',
  filePath = EDITOR_INSTALLERS_FILE_PATH
) => {
  const contents = await readFile(filePath, 'utf-8');

  const editorInstallers = JSON.parse(contents);

  const versions = Object.keys(editorInstallers);

  const [latest] = versions;

  const match =
    versions.find(version =>
      version.match(new RegExp(`^${filter.replace('x', '[0-9]+')}`, 'u'))
    ) || latest;

  return editorInstallers[match];
};
