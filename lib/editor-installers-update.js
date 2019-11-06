const fs = require('fs');
const {join} = require('path');
const {promisify} = require('util');

const writeFile = promisify(fs.writeFile);

const {JSDOM} = require('jsdom');

const checkCacheExpiry = require('../utils/check-cache-expiry');
const fetchWithLocalCache = require('../utils/fetch-with-local-cache');

const ARCHIVE_FILE_PATH = join(
    __dirname,
    '../temp/archive.html'
);

const JSON_TAB_WIDTH = 2;

const CACHE_TTL = 3600000;

const parseVersionFromUnityArchive = body => {

    const {document} = new JSDOM(body).window;

    return [].slice
        .call(document.querySelectorAll('a[href^="unityhub://"]'))
        .reduce(
            (acc, elem) => {

                const link = elem.getAttribute('href');
                const [
                    version,
                    hash
                ] = link.replace(
                    'unityhub://',
                    ''
                ).split('/');

                acc[version] = {
                    'mac': `https://download.unity3d.com/download_unity/${hash}/MacEditorInstaller/Unity-${version}.pkg`,
                    'win64': `https://download.unity3d.com/download_unity/${hash}/Windows64EditorInstaller/UnitySetup64-${version}.exe`
                };

                return acc;

            },
            {}
        );

};

const editorInstallersUpdate = editorInstallersFilePath =>
    checkCacheExpiry(
        editorInstallersFilePath,
        CACHE_TTL
    )
        .catch(() =>
            fetchWithLocalCache(
                'https://unity3d.com/get-unity/download/archive',
                ARCHIVE_FILE_PATH,
                CACHE_TTL
            )
                .then(parseVersionFromUnityArchive)
                .then(data =>
                    writeFile(
                        editorInstallersFilePath,
                        JSON.stringify(
                            data,
                            null,
                            JSON_TAB_WIDTH
                        )
                    )))
        .catch(() => {

            throw new Error('There was an error fetching the latest versions from unity3d.com');

        });
module.exports = editorInstallersUpdate;
