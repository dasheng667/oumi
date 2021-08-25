/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import path from 'path';
import { fsExtra as fs, LRU } from '@oumi/cli-shared-utils';
// import cwd from './cwd';
import type { SocketContext } from '../../typings/index';

// const hiddenPrefix = '.';
// const isPlatformWindows = process.platform.indexOf('win') === 0;

const pkgCache = new LRU({
  max: 500,
  maxAge: 1000 * 5
});

// function isDirectory(file: string) {
//   file = file.replace(/\\/g, path.sep);
//   try {
//     return fs.stat(file).then((x: any) => x.isDirectory());
//   } catch (e) {
//     if (process.env.VUE_APP_CLI_UI_DEBUG) console.warn(e.message);
//   }
//   return false;
// }

// async function list(base: string) {
//   let dir = base;
//   if (isPlatformWindows) {
//     if (base.match(/^([A-Z]{1}:)$/)) {
//       dir = path.join(base, '\\');
//     }
//   }
//   const files = await fs.readdir(dir, 'utf8');

//   const f = await Promise.all(
//     files.map(async (file: string) => {
//       const folderPath = path.join(base, file);

//       const [directory, hidden] = await Promise.all([isDirectory(folderPath), isHidden(folderPath)]);
//       if (!directory) {
//         return null;
//       }
//       return {
//         path: folderPath,
//         name: file,
//         hidden
//       };
//     })
//   );
//   return f.filter((x) => !!x);
// }

// async function isHidden(file: string) {
//   try {
//     const prefixed = path.basename(file).charAt(0) === hiddenPrefix;
//     const result = {
//       unix: prefixed,
//       windows: false
//     };

//     if (isPlatformWindows) {
//       // result.windows = await isHiddenWindows(file);
//     }

//     return (!isPlatformWindows && result.unix) || (isPlatformWindows && result.windows);
//   } catch (e) {
//     if (process.env.VUE_APP_CLI_UI_DEBUG) {
//       console.log('file:', file);
//       console.error(e);
//     }
//   }
// }

// function generateFolder(file: string) {
//   return {
//     name: path.basename(file),
//     path: file
//   };
// }

// function getCurrent() {
//   const base = cwd.get();
//   return generateFolder(base);
// }

// function open(file: string, context: SocketContext) {
//   cwd.set(file, context);
//   return generateFolder(cwd.get());
// }

// function openParent(file: string, context: SocketContext) {
//   const newFile = path.dirname(file);
//   cwd.set(newFile, context);
//   return generateFolder(cwd.get());
// }

// function isPackage(file: string) {
//   try {
//     return fs.existsSync(path.join(file, 'package.json'));
//   } catch (e) {
//     console.warn(e.message);
//   }
//   return false;
// }

export function readPackage(file: string | null, context?: SocketContext, force = false) {
  if (file === null) return null;
  if (!force) {
    const cachedValue = pkgCache.get(file);
    if (cachedValue) {
      return cachedValue;
    }
  }
  const pkgFile = path.join(file, 'package.json');
  if (fs.existsSync(pkgFile)) {
    const pkg = fs.readJsonSync(pkgFile);
    pkgCache.set(file, pkg);
    return pkg;
  }
}

// function writePackage({ file, data }: any) {
//   fs.outputJsonSync(path.join(file, 'package.json'), data, {
//     spaces: 2
//   });
//   invalidatePackage(file);
//   return true;
// }

export function invalidatePackage(file: string | null) {
  if (file) {
    pkgCache.del(file);
  }
  return true;
}

// function isVueProject(file: string, context: SocketContext) {
//   if (!isPackage(file)) return false;

//   try {
//     const pkg = readPackage(file, context);
//     return Object.keys(pkg.devDependencies || {}).includes('@vue/cli-service');
//   } catch (e) {
//     if (process.env.VUE_APP_CLI_UI_DEBUG) {
//       console.log(e);
//     }
//   }
//   return false;
// }

// function isFavorite(file, context) {
//   return !!context.db.get('foldersFavorite').find({ id: file }).size().value();
// }

// function setFavorite({ file, favorite }, context) {
//   const collection = context.db.get('foldersFavorite');
//   if (favorite) {
//     collection.push({ id: file }).write();
//   } else {
//     collection.remove({ id: file }).write();
//   }
//   return generateFolder(file, context);
// }

// async function deleteFolder(file) {
//   await fs.remove(file);
// }

// function createFolder(name, context) {
//   const file = path.join(cwd.get(), name);
//   fs.mkdirpSync(file);
//   return generateFolder(file, context);
// }
