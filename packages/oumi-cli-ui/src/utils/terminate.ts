import util from 'util';
import cp from 'child_process';
import path from 'path';
import { isWindows, isLinux, isMacintosh } from '@oumi/cli-shared-utils';

const execFile = util.promisify(cp.execFile);
const spawn = util.promisify(cp.spawn);

export default async function (childProcess: any, cwd: any) {
  if (isWindows) {
    try {
      const options: any = {
        stdio: ['pipe', 'pipe', 'ignore']
      };
      if (cwd) {
        options.cwd = cwd;
      }
      await execFile('taskkill', ['/T', '/F', '/PID', childProcess.pid.toString()], options);
    } catch (err) {
      return { success: false, error: err };
    }
  } else if (isLinux || isMacintosh) {
    try {
      const cmd = path.resolve(__dirname, './terminate.sh');
      const result: any = await spawn(cmd, [childProcess.pid.toString()], {
        cwd
      });
      if (result.error) {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err };
    }
  } else {
    childProcess.kill('SIGKILL');
  }
  return { success: true };
}
