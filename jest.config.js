// eslint-disable-next-line @typescript-eslint/no-var-requires
const { jsWithTs: tsjPreset } = require('ts-jest/presets');
const path = require('path');

module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsjPreset.transform
  },
  testURL: 'http://localhost/',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: {
        jsx: 'react',
        allowJs: true,
        strict: false,
        alwaysStrict: false,
        target: 'ES6',
        noUnusedLocals: false,
        noUnusedParameters: false,
        noImplicitAny: false
      }
    }
  },
  testPathIgnorePatterns: ['node_modules', 'utils'],
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)']
};
