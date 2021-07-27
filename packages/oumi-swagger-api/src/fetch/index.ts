import request from 'request';

export default function fetch(url: string) {
  if (!url) {
    throw new Error('url 不能为空');
  }
  return new Promise((resolve, reject) => {
    request(
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
