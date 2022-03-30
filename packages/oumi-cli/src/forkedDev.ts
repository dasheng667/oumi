/* eslint-disable no-console */
/* eslint-disable no-inner-declarations */
import { getCwd, resolvePkg, chalk, yParser } from '@oumi/cli-shared-utils';
import { Kernel } from '@oumi/kernel';
import plugins from './plugins/index';

(async () => {
  try {
    const args = yParser(process.argv.slice(2));
    const { type } = args;

    process.env.NODE_ENV = 'development';

    const kernel = new Kernel({
      appPath: getCwd(),
      pkg: resolvePkg(process.cwd()),
      presets: [...plugins().plugins]
    });

    await kernel.run({
      name: 'dev',
      args
    });

    let closed = false;

    function onSignal(signal: any) {
      if (closed) return;
      closed = true;

      // 退出时触发插件中的onExit事件
      // kernel.applyPlugins({
      //   key: 'onExit',
      //   type: kernel.ApplyPluginsType.event,
      //   args: {
      //     signal,
      //   },
      // });
      // process.exit(0);
    }

    // kill(2) Ctrl-C
    process.once('SIGINT', () => onSignal('SIGINT'));
    // kill(3) Ctrl-\
    process.once('SIGQUIT', () => onSignal('SIGQUIT'));
    // kill(15) default
    process.once('SIGTERM', () => onSignal('SIGTERM'));
  } catch (e: any) {
    console.error(chalk.red(e.message));
    console.error(e.stack);
    process.exit(1);
  }
})();
