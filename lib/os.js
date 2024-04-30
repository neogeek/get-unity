import os from 'node:os';

export const getOperatingSystemKey = () => {
  if (os.type() === 'Darwin' && os.arch() === 'arm64') {
    return 'macArm64';
  } else if (os.type() === 'Darwin') {
    return 'mac';
  } else if (os.type() === 'Linux') {
    return 'linux';
  } else if (os.type() === 'Windows_NT') {
    return 'win64';
  }
};
