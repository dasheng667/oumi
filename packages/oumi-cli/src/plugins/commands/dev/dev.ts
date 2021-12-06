import { portfinder, getModuleExport, getNpmPkg } from '@oumi/cli-shared-utils';
import Webpack from '@oumi/webpack-runner';
import type { IApi } from '@oumi/kernel/typings/type';

export default (api: IApi) => {
  let port: number;
  let hostname: string;
  const { appPath } = api;

  api.registerCommand({
    name: 'dev',
    async fn({ args }) {
      console.log('dev.args', args);

      const defaultPort = process.env.PORT || args?.port || api.config?.devServer?.port;
      port = await portfinder.getPortPromise({
        port: defaultPort ? parseInt(String(defaultPort), 10) : 8000
      });

      hostname = process.env.HOST || api.config?.devServer?.host || '0.0.0.0';

      console.log('appPath', appPath);
      console.log('port', port);
      console.log('hostname', hostname);

      const webpack = Webpack(appPath, {
        watch: true
      });
    }
  });
};
