import path from 'path';
import Swagger from '../src/index';
import { writeFile } from './utils';

const swagger = new Swagger();

swagger.fetchApi('https://x-docs').then((res) => {
  swagger
    .query({ path: [, , /* 'boms/api/earmarks/pool' */ /* 'supplierBankInfo' */ 'timingDistribute'] }, (queryList) => {
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
      filterPathPrefix: 'api'
    })
    .buildMockJS({
      outputPath: path.resolve('./example/build')
    });
});
