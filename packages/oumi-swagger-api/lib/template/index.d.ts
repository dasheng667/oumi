/**
 * ts接口模板
 * @param name interface的名称
 * @param data
 * @returns
 */
export declare const interfaceTemp: (name: string, data: any) => string;
export declare const requestTemp: (options: {
    method: string;
    url: string;
    params?: any;
    fileType?: 'js' | 'ts';
}) => string;
