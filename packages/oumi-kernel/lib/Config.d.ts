interface Options {
    appPath: string;
    configFiles?: string[];
}
export default class Config {
    appPath: string;
    configFiles: string[];
    initialConfig: any;
    constructor(opts: Options);
    getConfigFile(): string | null;
    getUserConfig(): any;
}
export {};
