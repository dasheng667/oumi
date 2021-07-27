import { Chalk } from 'chalk';

export function got (url: string): any;

export function launch (text: string): any;

export const request: {
  get: (url: string, opt?: any) => string;
}

export function startSpinner(symbol: any, msg: string): void;

export function stopSpinner(persist?: any): void;

export function failSpinner(text?: string): void;

export function pauseSpinner(): void;

export function resumeSpinner(): void;

export const chalk: Chalk;

export const spawn: any;

export function writeJSON(filePath: string, data: object, callback?: any): void;

export function createFileSync(filePath: string): void;

export function ensureDirSync(filePath: string): void;

export function writeFile(filePath: string, content: string, options?: { isCreateFile: boolean }): void;

export const base64: {
  /** 编码 */
  encode: (input: string) => string;
  /** 解码 */
  decode: (input: string) => string;

  safeUrlEncode: (input: string) => string;

  safeUrlDecode: (input: string) => string;
}
