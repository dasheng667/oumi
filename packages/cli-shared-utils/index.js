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
  'cross-spawn',
  'module',
  'rcFolder',
  'PackageManager',
  'executeCommand',
  'npm',
  'path',
  'fork'
].forEach(m => {
  Object.assign(exports, require(`./lib/${m}`))
})

exports.chalk = require('chalk')
exports.execa = require('execa')
exports.semver = require('semver')
exports.fsExtra = require('fs-extra')
exports.LRU = require('lru-cache')
exports.fetch  = require('node-fetch')
exports.yParser  = require('yargs-parser')
exports.createDebug  = require('debug')
exports.lodash  = require('lodash')
exports.portfinder  = require('portfinder')

Object.defineProperty(exports, 'installedBrowsers', {
  enumerable: true,
  get () {
    return exports.getInstalledBrowsers()
  }
})
