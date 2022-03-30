import { getWebpackConfig } from '@oumi/webpack-runner';
import { inspect } from 'util';
import type { IApi } from '@oumi/kernel/typings/type';

export default (api: IApi) => {
  const { appPath, config } = api;

  api.registerCommand({
    name: 'webpack',
    async fn({ args }) {
      const wpConfig = await getWebpackConfig(appPath, { userConfig: config });
      console.log('webpack Config = ');
      console.log(inspect(wpConfig, false, null, true));
    }
  });
};
