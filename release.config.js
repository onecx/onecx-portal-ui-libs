module.exports = {
  branches: ['main', { name: "v4", range: "4.x.x", channel: "4.x.x" }],
  preset: 'conventionalcommits',
  presetConfig: {
    types: [
      { type: 'feat', section: 'Features' },
      { type: 'fix', section: 'Bug Fixes' },
      { type: 'chore', section: 'Chores' },
      { type: 'docs', hidden: true },
      { type: 'style', hidden: true },
      { type: 'refactor', section: 'Refactoring' },
      { type: 'perf', hidden: true },
      { type: 'test', hidden: true },
    ],
  },
  releaseRules: [{ type: 'refactor', release: 'patch' }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: `./CHANGELOG.md`,
      },
    ],
    [
      '@semantic-release/exec',
      {
       prepareCmd: `./release-script.sh \${nextRelease.version}`,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [`libs/**/package.json`, `package.json`, `CHANGELOG.md`],
        message: 'chore(release): -v${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
}
