import path from 'path';
import Swagger from '../src/index';
import { writeFile } from './utils';
import OMS from './data/oms.json';

const swagger = new Swagger(OMS);

/**
 * 写法1，哪一种更好呢？
 */
swagger
  .query({ path: '/api' }, (queryList) => {
    writeFile(`./example/build/queryList.json`, queryList);
  })
  .toResponseJSON((json) => {
    writeFile(`./example/build/response.json`, json);
  })
  .buildMockJSON({
    outputPath: path.resolve('./example/build/mock'),
    fileType: 'hump',
    filterPathPrefix: 'api'
  })
  .toTypeScript((json) => {
    writeFile(`./example/build/typescript.json`, json);
  })
  .buildApi({
    outputPath: path.resolve('./example/build/api'),
    fileType: 'ts',
    requestLibPath: "import request from '@/api/request'; ",
    outputFileType: 'merge',
    filterPathPrefix: 'api'
  })
  .buildMockJS({
    outputPath: path.resolve('./example/build')
  });

/**
 * 写法2，哪一种更好呢？
 */
/* const queryList = swagger.query({ tag: 'V1.0.0' });
writeFile(`./example/build/queryList.json`, queryList);

const json = swagger.toResponseJSON();
writeFile(`./example/build/response.json`, json);

swagger.buildMockJSON({
  outputPath: path.resolve('./example/build/mock'),
  fileType: 'hump',
  filterPathPrefix: 'api'
})

const json2 = swagger.toTypeScript()
writeFile(`./example/build/typescript.json`, json2);

swagger.toInterfaceTemp();

swagger.buildApi({
  outputPath: path.resolve('./example/build/api'),
  fileType: 'ts',
  requestLibPath: "import request from '@/api/request'; ",
  filterPathPrefix: 'api'
}); */
