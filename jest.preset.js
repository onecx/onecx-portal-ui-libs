const nxPreset = require('@nx/jest/preset').default;

module.exports = { 
    ...nxPreset,
    snapshotFormat: { escapeString: true, printBasicPrototype: true },
 };
