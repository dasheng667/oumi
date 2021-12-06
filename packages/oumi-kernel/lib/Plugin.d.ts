import type Kernel from './Kernel';
import type { IHook } from '../typings/type';
export default class Plugin {
    id: string;
    path: string;
    ctx: Kernel;
    optsSchema: (...args: any[]) => void;
    constructor(opts: any);
    register(hook: IHook): void;
    registerCommand(command: IHook): void;
    registerMethod(...args: any[]): void;
    addPluginOptsSchema(schema: any): void;
}
