import path from 'path';

const resolve = (p) => {
  return path.resolve(__dirname, '../', p);
};

export default () => {
  return {
    plugins: [resolve('./plugins/commands/dev/dev')]
  };
};
