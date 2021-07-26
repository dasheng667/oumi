import toResponseJSON from '../src/core/toResponseJSON';
import { response1 } from './mock/response.test';

describe('测试 response', () => {
  it('response1', () => {
    expect(toResponseJSON(response1)).toEqual({
      addTime: 'string',
      companyId: ['1']
    });
  });
});
