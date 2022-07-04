const versionRegex = /[0-9]+\.[0-9]+\.[0-9]+[a-z][0-9]+/u;

export const parseVersionFromString = (contents = '') => {
  const matches = contents.match(versionRegex);

  if (matches && matches.length > 0) {
    return matches[0];
  }

  throw new Error('Failed to parse version from string.');
};
