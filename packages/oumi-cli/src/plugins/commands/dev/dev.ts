import type { IApi } from '@oumi/kernel/typings/type';

export default (api: IApi) => {
  api.registerCommand({
    name: 'dev',
    async fn({ args }) {
      console.log('dev.args', args);
    }
  });
};
