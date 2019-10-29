const editorInstallers = require('../data/editor-installers.json');

const getUnityUrls = (filter = '') =>
    new Promise(resolve => {

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

        resolve(editorInstallers[match]);

    });
module.exports = getUnityUrls;
