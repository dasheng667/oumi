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

Object.defineProperty(exports, 'installedBrowsers', {
  enumerable: true,
  get () {
    return exports.getInstalledBrowsers()
  }
})
