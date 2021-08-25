'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const request_1 = __importDefault(require('request'));
function fetch(url) {
  if (!url) {
    throw new Error('url 不能为空');
  }
  return new Promise((resolve, reject) => {
    request_1.default(
      {
        url,
        method: 'GET',
        json: true,
        headers: {
          'content-type': 'application/json'
        }
      },
      (error, response, body) => {
        if (!error && response.statusCode === 200 && typeof body === 'object') {
          resolve(body);
        } else {
          reject(body || error || new Error('错误的数据'));
        }
      }
    );
  });
}
exports.default = fetch;
