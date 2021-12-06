const child_process = require('child_process');
const { resolvePath } = require('resolve');

const PEERS = /UNMET PEER DEPENDENCY ([a-z\-0-9.]+)@(.+)/gm
const npmCached = {}
const erroneous = []
const oumiPluginPrefix = '@oumi/plugin-'

const execSync = child_process.execSync;

exports.resolveNpm = function resolveNpm (pluginName, root) {
  if (!npmCached[pluginName]) {
    return new Promise((resolve, reject) => {
      resolvePath(`${pluginName}`, { basedir: root }, (err, res) => {
        if (err) {
          return reject(err)
        }
        npmCached[pluginName] = res
        resolve(res || '')
      })
    })
  }
  return Promise.resolve(npmCached[pluginName])
}

exports.installNpmPkg = function installNpmPkg (pkgList, options) {
  if (!pkgList) {
    return
  }
  if (!Array.isArray(pkgList)) {
    pkgList = [pkgList]
  }
  pkgList = pkgList.filter(dep => {
    return erroneous.indexOf(dep) === -1
  })

  if (!pkgList.length) {
    return
  }
  options = Object.assign({}, defaultInstallOptions, options)
  let installer = ''
  let args = []

  if (shouldUseYarn()) {
    installer = 'yarn'
  } else if (shouldUseCnpm()) {
    installer = 'cnpm'
  } else {
    installer = 'npm'
  }

  if (shouldUseYarn()) {
    args = ['add'].concat(pkgList).filter(Boolean)
    args.push('--silent', '--no-progress')
    if (options.dev) {
      args.push('-D')
    }
  } else {
    args = ['install'].concat(pkgList).filter(Boolean)
    args.push('--silent', '--no-progress')
    if (options.dev) {
      args.push('--save-dev')
    } else {
      args.push('--save')
    }
  }
  const output = spawn.sync(installer, args, {
    stdio: ['ignore', 'pipe', 'inherit']
  })
  if (output.status) {
    pkgList.forEach(dep => {
      erroneous.push(dep)
    })
  }
  let matches = null
  const peers = []

  while ((matches = PEERS.exec(output.stdout))) {
    const pkg = matches[1]
    const version = matches[2]
    if (version.match(' ')) {
      peers.push(pkg)
    } else {
      peers.push(`${pkg}@${version}`)
    }
  }
  if (options.peerDependencies && peers.length) {
    console.info('正在安装 peerDependencies...')
    installNpmPkg(peers, options)
  }
  return output
}

exports.resolveNpmSync = function resolveNpmSync (pluginName, root) {
  try {
    if (!npmCached[pluginName]) {
      const res = resolvePath.sync(pluginName, { basedir: root })
      return res
    }
    return npmCached[pluginName]
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log(chalk.cyan(`缺少npm包${pluginName}，开始安装...`))
      const installOptions = {
        dev: false
      }
      if (pluginName.indexOf(oumiPluginPrefix) >= 0) {
        installOptions.dev = true
      }
      installNpmPkg(pluginName, installOptions)
      return resolveNpmSync(pluginName, root)
    }
    return ''
  }
}

exports.getNpmPkgSync =  function getNpmPkgSync (npmName, root) {
  const npmPath = resolveNpmSync(npmName, root)
  return require(npmPath)
}

exports.getNpmPkg = async function (npmName, root) {
  let npmPath
  try {
    npmPath = resolveNpmSync(npmName, root)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log(chalk.cyan(`缺少npm包${npmName}`))
      const installOptions = {
        dev: false
      }
      if (npmName.indexOf(oumiPluginPrefix) >= 0) {
        installOptions.dev = true
      }
      installNpmPkg(npmName, installOptions)
      npmPath = await resolveNpm(npmName, root)
    }
  }
  const npmFn = require(npmPath)
  return npmFn
}


exports.shouldUseYarn = function shouldUseYarn () {
  try {
    execSync('yarn --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

exports.shouldUseCnpm = function shouldUseCnpm () {
  try {
    execSync('cnpm --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}