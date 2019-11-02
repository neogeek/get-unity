const fs = require('fs');
const {promisify} = require('util');

const stat = promisify(fs.stat);

const checkCacheExpiry = (path, ttl) =>
    stat(path).then(({mtime}) => {

        if (new Date(mtime).getTime() + ttl < Date.now()) {

            throw new Error('Cache has expired.');

        }

    });

module.exports = checkCacheExpiry;
