import { buildMockStr } from '../src/template/mockjs';
import { mockDataList, mockObject, mockRootBoolean } from './mock/mockTemp.test';

// describe('测试 response', () => {
//   it('response1', () => {
//     expect(buildMockStr(mockDataList)).toEqual('');
//   });
// });

// console.log(buildMockStr(mockObject))

console.log(buildMockStr(mockDataList));

console.log(buildMockStr(mockRootBoolean));
