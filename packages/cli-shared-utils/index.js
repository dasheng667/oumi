[
  'env',
  'exit',
  'logger',
  'object',
  'openBrowser',
  'pkg',
  'launch',
  'request',
  'spinner',
  'validate',
  'got',
  'file',
  'base64',
  'cross-spawn'
].forEach(m => {
  Object.assign(exports, require(`./lib/${m}`))
})

exports.chalk = require('chalk')
exports.execa = require('execa')
exports.semver = require('semver')
exports.fsExtra = require('fs-extra')
exports.LRU = require('lru-cache')

Object.defineProperty(exports, 'installedBrowsers', {
  enumerable: true,
  get () {
    return exports.getInstalledBrowsers()
  }
})
