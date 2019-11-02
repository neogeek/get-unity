const fs = require('fs');
const {dirname} = require('path');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const mkdirp = promisify(require('mkdirp'));
const request = promisify(require('request'));

const checkCacheExpiry = require('./check-cache-expiry');

const DEFAULT_CACHE_TTL = 3600000;

const fetchWithLocalCache = (url, localCachePath, ttl = DEFAULT_CACHE_TTL) =>
    checkCacheExpiry(
        localCachePath,
        ttl
    )
        .then(() => readFile(
            localCachePath,
            'utf8'
        ))
        .catch(() =>
            request(url).then(({body}) =>
                mkdirp(dirname(localCachePath)).then(() =>
                    writeFile(
                        localCachePath,
                        body
                    ).then(() => body))));

module.exports = fetchWithLocalCache;
