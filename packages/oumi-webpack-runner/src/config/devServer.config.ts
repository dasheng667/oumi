import type WebpackDevServer from 'webpack-dev-server';

const devServerConf: WebpackDevServer.Configuration = {
  compress: true,
  historyApiFallback: {
    disableDotRule: true
  },
  host: 'localhost',
  hot: true,
  https: false,
  open: true,
  port: 8000
};

export default devServerConf;
