export { default as toResponseJSON } from '@oumi/swagger-api/src/core/toResponseJSON';

export const createId = (max: number = 8, randomString?: string) => {
  const s = [];
  const hexDigits = randomString || '0123456789abcdef';
  for (let i = 0; i < max; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * hexDigits.length), 1);
  }
  return s.join('');
};
