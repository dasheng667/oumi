import path from 'path';
import Swagger from '../src/index';
import { writeFile } from './utils';

const swagger = new Swagger();

swagger.fetchApi('***').then((res) => {
  swagger
    .query({ path: ['scanOrder/scanTotalOrderResult', 'mall/didiOrder/get'] }, (queryList) => {
      writeFile(`./build/queryList.json`, queryList);
    })
    .toResponseJSON((json) => {
      writeFile(`./build/response.json`, json);
    })
    // .buildMockJSON({
    //   outputPath: path.resolve('./build/mock'),
    //   fileType: 'hump',
    //   filterPathPrefix: 'api'
    // })
    .toTypeScript((json) => {
      writeFile(`./build/typescript.json`, json);
    });
  // .buildApi({
  //   outputPath: path.resolve('./build/api'),
  //   fileType: 'ts',
  //   requestLibPath: "import request from '@/api/request'; ",
  //   filterPathPrefix: 'api'
  // })
  // .buildMockJS({
  //   outputPath: path.resolve('./build')
  // });
});
