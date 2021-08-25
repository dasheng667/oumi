import toResponseJSON from '../src/core/toResponseJSON';
import { response1, response_file } from './mock/response.test';

describe('测试 response', () => {
  it('response1', () => {
    expect(toResponseJSON(response1)).toEqual({
      addTime: 'string',
      companyId: ['1']
    });
  });

  it('response_file', () => {
    const res = toResponseJSON(response_file);
    expect(res).toEqual({
      file: 'file',
      billShelfId: 'string'
    });
  });
});
