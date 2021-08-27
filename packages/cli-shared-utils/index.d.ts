import { Chalk } from 'chalk';
import { Ora } from 'ora';
import { RequestInfo, RequestInit, Response } from 'node-fetch';

export function got (url: string): any;

export function launch (text: string): any;

export const request: {
  getJSON: (url: string, opt?: any) => Promise<object>;
  get: (url: string, opt?: any) => Promise<any>;
}

export const spinner: Ora;

export const fetch: ( url: RequestInfo, init?: RequestInit ) => Promise<Response>;

export function startSpinner(symbol: any, msg: string): void;

export function stopSpinner(persist?: any): void;

export function failSpinner(text?: string): void;

export function successSpinner(text?: string): void;

export function pauseSpinner(): void;

export function resumeSpinner(): void;

export const chalk: Chalk;

export const rcFolder: string;

export const execa: any;

export const spawn: any;

export const fsExtra: any;

export const LRU: any;

export const PackageManager: any;

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


export function resolveModule(request: string, context: string): string;

export const isWindows: boolean;

export const isLinux: boolean;

export const isMacintosh: boolean;

export const progress: any;