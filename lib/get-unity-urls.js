const fs = require('fs');
const {join} = require('path');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);

const EDITOR_INSTALLERS_FILE_PATH = join(
    __dirname,
    '../data/editor-installers.json'
);

const getUnityUrls = (filter = '', filePath = EDITOR_INSTALLERS_FILE_PATH) =>
    readFile(filePath)
        .then(data => JSON.parse(data))
        .then(editorInstallers => {

            const versions = Object.keys(editorInstallers);

            const [latest] = versions;

            const match =
        versions.find(version =>
            version.match(new RegExp(
                `^${filter.replace(
                    'x',
                    '[0-9]+'
                )}`,
                'u'
            ))) || latest;

            return editorInstallers[match];

        });
module.exports = getUnityUrls;
