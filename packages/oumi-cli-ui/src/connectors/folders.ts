/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import path from 'path';
import { fsExtra as fs, LRU } from '@oumi/cli-shared-utils';
// import cwd from './cwd';
import type { SocketContext } from '../../typings/index';

const pkgCache = new LRU({
  max: 500,
  maxAge: 1000 * 5
});

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
//     if (process.env.OUMI_APP_CLI_UI_DEBUG) {
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
