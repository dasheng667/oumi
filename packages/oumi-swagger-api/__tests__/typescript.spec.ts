import toTypeScript from '../src/core/toTypeScript';
import { response1, response_file, responseInSchema } from './mock/response.test';

describe('test toTypeScript', () => {
  it('ts1', () => {
    expect(toTypeScript(response1)).toEqual({
      props: {
        addTime: {
          type: 'string',
          format: 'date-time',
          description: '添加时间'
        },
        companyId: {
          items: {
            type: 'string'
          },
          type: 'array'
        }
      }
    });
  });

  it('ts responseInSchema', () => {
    expect(toTypeScript(responseInSchema)).toEqual({
      props: {
        phoneNum: {
          name: 'phoneNum',
          description: '手机号',
          required: true,
          type: 'string'
        },
        sendId: {
          name: 'sendId',
          description: '业务点id',
          required: true,
          type: 'string'
        },
        code: {
          name: 'code',
          description: '编码',
          required: true,
          type: 'string'
        }
      }
    });
  });
});
