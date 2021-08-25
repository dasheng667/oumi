import type { Context as KoaContext } from 'koa';
import type modelDB from '../src/model/db';

export { Response, Request } from 'koa';

export { Server as IOServer } from 'socket.io';

interface ReturnOptions {
  code?: number;
  msg?: string;
  success?: boolean;
  data?: any;
}

type ReturnData = string | boolean | number | object | any[];

type Request2 = Request & {
  body: any;
};

export type Context = KoaContext & {
  /** 返回成功 */
  returnSuccess: (data: ReturnData, options?: ReturnOptions) => void;
  /** 返回错误 */
  returnError: (options: string | ReturnOptions) => void;
  /** Modal */
  model: typeof modelDB;

  request: Request2;
};

export type Next = () => void;

export type SocketContext = {
  pubsub: {
    publish: (channels: string, data: any) => void;
  };
};

export type TaskItem = {
  id: string;
  name: string;
  command: string;
  index: number;
  time: number;
  prompts: any[];
  views: any[];
  logs: any[];
  path: string | null;
  status: string;
  child: null | any;
  [k: string]: any;
};

export type Log = {
  taskId: string;
  type: string;
  text: string;
};
