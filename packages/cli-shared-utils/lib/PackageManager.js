const path = require('path');
const { hasProjectYarn, hasProjectPnpm, hasProjectNpm, hasPnpmVersionOrLater } = require('./env');
// const { resolvePkg } = require('./pkg');
const { executeCommand } = require('./executeCommand');

const SUPPORTED_PACKAGE_MANAGERS = ['yarn', 'pnpm', 'npm']

const PACKAGE_MANAGER_PNPM4_CONFIG = {
  install: ['install', '--reporter', 'silent', '--shamefully-hoist'],
  add: ['install', '--reporter', 'silent', '--shamefully-hoist'],
  upgrade: ['update', '--reporter', 'silent'],
  remove: ['uninstall', '--reporter', 'silent']
}
const PACKAGE_MANAGER_PNPM3_CONFIG = {
  install: ['install', '--loglevel', 'error', '--shamefully-flatten'],
  add: ['install', '--loglevel', 'error', '--shamefully-flatten'],
  upgrade: ['update', '--loglevel', 'error'],
  remove: ['uninstall', '--loglevel', 'error']
}

const PACKAGE_MANAGER_CONFIG = {
  npm: {
    install: ['install', '--loglevel', 'error'],
    add: ['install', '--loglevel', 'error'],
    upgrade: ['update', '--loglevel', 'error'],
    remove: ['uninstall', '--loglevel', 'error']
  },
  pnpm: hasPnpmVersionOrLater('4.0.0') ? PACKAGE_MANAGER_PNPM4_CONFIG : PACKAGE_MANAGER_PNPM3_CONFIG,
  yarn: {
    install: [],
    add: ['add'],
    upgrade: ['upgrade'],
    remove: ['remove']
  }
}

function stripVersion (packageName) {
  const nameRegExp = /^(@?[^@]+)(@.*)?$/
  const result = packageName.match(nameRegExp)

  if (!result) {
    throw new Error(`Invalid package name ${packageName}`)
  }

  return result[1]
}

class PackageManager {
  constructor ({ context, forcePackageManager } = {}) {
    this.context = context || process.cwd()
    this._registries = {}

    if (forcePackageManager) {
      this.bin = forcePackageManager
    } else if (context) {
      if (hasProjectYarn(context)) {
        this.bin = 'yarn'
      } else if (hasProjectPnpm(context)) {
        this.bin = 'pnpm'
      } else if (hasProjectNpm(context)) {
        this.bin = 'npm'
      }
    }


    if (this.bin === 'npm') {
      // npm doesn't support package aliases until v6.9
      console.error('暂不支持npm');
    }

    if (!SUPPORTED_PACKAGE_MANAGERS.includes(this.bin)) {
      console.error('bin 不能为空');
    }

    // Plugin may be located in another location if `resolveFrom` presents.
    // const projectPkg = resolvePkg(this.context)
    // const resolveFrom = projectPkg && projectPkg.vuePlugins && projectPkg.vuePlugins.resolveFrom

    // Logically, `resolveFrom` and `context` are distinct fields.
    // But in Vue CLI we only care about plugins.
    // So it is fine to let all other operations take place in the `resolveFrom` directory.
    // if (resolveFrom) {
    //   this.context = path.resolve(context, resolveFrom)
    // }
  }

  async runCommand (command, args) {
    const prevNodeEnv = process.env.NODE_ENV
    // In the use case of Vue CLI, when installing dependencies,
    // the `NODE_ENV` environment variable does no good;
    // it only confuses users by skipping dev deps (when set to `production`).
    delete process.env.NODE_ENV

    // await this.setRegistryEnvs()
    await executeCommand(
      this.bin,
      [
        ...PACKAGE_MANAGER_CONFIG[this.bin][command],
        ...(args || [])
      ],
      this.context
    )

    if (prevNodeEnv) {
      process.env.NODE_ENV = prevNodeEnv
    }
  }

  async add (packageName, {
    tilde = false,
    dev = true
  } = {}) {
    const args = dev ? ['-D'] : []
    if (tilde) {
      if (this.bin === 'yarn') {
        args.push('--tilde')
      } else {
        process.env.npm_config_save_prefix = '~'
      }
    }

    if (this.needsPeerDepsFix) {
      args.push('--legacy-peer-deps')
    }

    return await this.runCommand('add', [packageName, ...args])
  }

  async remove (packageName) {
    return await this.runCommand('remove', [packageName])
  }

  async upgrade (packageName) {
    const packageNamesArray = []

    for (const packname of packageName.split(' ')) {
      packageNamesArray.push(packname)
    }

    if (packageNamesArray.length) return await this.runCommand('add', packageNamesArray)
  }

}

exports.PackageManager = PackageManager;