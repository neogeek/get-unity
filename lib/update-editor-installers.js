const { join } = require('path');

const { JSDOM } = require('jsdom');

const {
    fetch,
    utils: { readCache, writeCache }
} = require('raspar');

const EDITOR_INSTALLERS_FILE_PATH = join(
    __dirname,
    '../data/editor-installers.json'
);

const JSON_TAB_WIDTH = 2;

const DEFAULT_CACHE_TTL = 3600000;

const parseVersionFromUnityArchive = body => {
    const { document } = new JSDOM(body).window;

    return [].slice
        .call(document.querySelectorAll('a[href^="unityhub://"]'))
        .reduce((acc, elem) => {
            const link = elem.getAttribute('href');

            const [version, hash] = link.replace('unityhub://', '').split('/');

            acc[version] = {
                linux: `https://download.unity3d.com/download_unity/${hash}/LinuxEditorInstaller/Unity.tar.xz`,
                mac: `https://download.unity3d.com/download_unity/${hash}/MacEditorInstaller/Unity-${version}.pkg`,
                win64: `https://download.unity3d.com/download_unity/${hash}/Windows64EditorInstaller/UnitySetup64-${version}.exe`
            };

            return acc;
        }, {});
};

const updateEditorInstallers = (
    filePath = EDITOR_INSTALLERS_FILE_PATH,
    ttl = DEFAULT_CACHE_TTL
) =>
    readCache(filePath, ttl).catch(() =>
        fetch('https://unity3d.com/get-unity/download/archive', {
            cacheDirectory: join(__dirname, '../temp/cache')
        })
            .then(parseVersionFromUnityArchive)
            .then(data =>
                writeCache(filePath, JSON.stringify(data, null, JSON_TAB_WIDTH))
            )
    );

module.exports = updateEditorInstallers;
