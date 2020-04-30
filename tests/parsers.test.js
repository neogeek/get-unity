const { parsers } = require('../');

test('Parse version from ProjectVersion.txt', () => {
    const projectVersionContents = `m_EditorVersion: 2019.2.9f1
m_EditorVersionWithRevision: 2019.2.9f1 (ebce4d76e6e8)`;

    expect(parsers.parseVersionFromString(projectVersionContents)).toBe(
        '2019.2.9f1'
    );
});

test('Fail to parse version from empty string', () => {
    expect(() => parsers.parseVersionFromString('')).toThrow(Error);
});
