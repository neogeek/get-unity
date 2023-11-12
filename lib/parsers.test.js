import { test } from 'node:test';
import assert from 'node:assert';

import { parseVersionFromString } from './parsers.js';

test('Parse version from ProjectVersion.txt', () => {
  const projectVersionContents = `m_EditorVersion: 2019.2.9f1
m_EditorVersionWithRevision: 2019.2.9f1 (ebce4d76e6e8)`;

  assert.strictEqual(
    parseVersionFromString(projectVersionContents),
    '2019.2.9f1'
  );
});

test('Fail to parse version from empty string', () => {
  assert.throws(() => parseVersionFromString(''), {
    name: 'Error',
    message: 'Failed to parse version from string.',
  });
});
