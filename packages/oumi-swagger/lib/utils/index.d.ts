import { Query } from '../../typings/swagger';
export declare const validataQuery: (requestData: any, requestPath: string, options: Query) => boolean;
export declare const dataType: string[];
/**
 * 校验节点是不是声明类型，声明数据必有type
 * @param node 节点
 * @returns
 */
export declare function verifyNodeIsDeclarationType(node: any): boolean;
export declare function findResponseRef(request: any): any;
export declare function isObject(val: any): boolean;
export declare function stringCase(str: string): string;
/**
 * 把路径拼装成驼峰式 文件名 transform
 * @param path 需要转换的路径
 * @param filterPrefix 需要过滤的前缀
 * @returns
 */
export declare function transformPath(path: string, filterPrefix?: string): {
    key: string;
    path: string;
};
export declare const log: {
    red(...args: any[]): void;
    blue(...args: any[]): void;
    green(...args: any[]): void;
    yellow(...args: any[]): void;
    gray(...args: any[]): void;
};
