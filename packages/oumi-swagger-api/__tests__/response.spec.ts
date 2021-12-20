import toResponseJSON from '../src/core/toResponseJSON';
import { response1, response_file, responseInSchema } from './mock/response.test';

describe('test toResponseJSON', () => {
  it('response1', () => {
    expect(toResponseJSON(response1)).toEqual({
      addTime: 'string',
      companyId: ['1']
    });
  });

  it('responseInSchema', () => {
    const res = toResponseJSON(responseInSchema);
    expect(res).toEqual({
      phoneNum: 'string',
      sendId: 'string',
      code: 'string'
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
