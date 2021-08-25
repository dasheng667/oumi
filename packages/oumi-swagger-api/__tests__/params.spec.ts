import definitionsData from './mock/definitions1';
import definitionsFile from './mock/definitions_file';
import { requestParams1, requestParams2, requestParams3, requestFile } from './mock/params.test';
import parametersBody from '../src/core/parameters';

describe('测试 params', () => {
  it('params.test', () => {
    const params = parametersBody(definitionsData, {});
    expect(params).toEqual(null);
  });

  it('params.requestParams1', () => {
    const params = parametersBody(definitionsData, {
      parameters: requestParams1
    });
    expect(params).toEqual({
      addTimeStart: {
        description: '创建开始日期',
        format: 'date-time',
        in: 'query',
        name: 'addTimeStart',
        required: false,
        type: 'string'
      },
      productCode2: {
        description: '商品编码',
        in: 'query',
        name: 'productCode2',
        required: false,
        type: 'string'
      },
      responsibleId: {
        description: '责任方id',
        in: 'query',
        name: 'responsibleId',
        required: false,
        type: 'string'
      },
      sourceBillId: {
        description: '来源单据号',
        format: 'int64',
        in: 'query',
        name: 'sourceBillId',
        required: false,
        type: 'integer'
      }
    });
  });

  it('params.ref.requestParams2', () => {
    const params = parametersBody(definitionsData, {
      parameters: requestParams2
    });
    expect(params).toEqual({
      queryVO: {
        abnormalNum: {
          description: '异常数量',
          example: 1,
          format: 'int32',
          type: 'integer'
        }
      }
    });
  });

  it('params.query', () => {
    const params = parametersBody(definitionsData, {
      parameters: requestParams3
    });
    expect(params).toEqual({
      groupId: {
        description: 'groupId',
        format: 'int64',
        in: 'query',
        name: 'groupId',
        required: true,
        type: 'integer'
      }
    });
  });

  it('params.file', () => {
    const params = parametersBody(definitionsFile, {
      parameters: requestFile
    });

    expect(params).toEqual({
      file: {
        name: 'file',
        in: 'formData',
        description: '上传文件',
        required: true,
        type: 'file'
      }
    });
  });
});
