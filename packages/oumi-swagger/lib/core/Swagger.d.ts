import { Query, QueryListItem, InterfaceTempCallback, ResponseCallback, BuildMockOption, BuildApiOption } from '../../typings/swagger';
/**
 * Swagger 拉取工具
 */
export default class Swagger {
    body: any;
    responseData: any;
    typescriptData: any;
    queryList: QueryListItem;
    step: "" | "mock" | "typescript";
    constructor(body?: Object);
    fetchApi(url: string): Promise<any>;
    query(options: Query, callback?: (list: any) => void): this;
    /**
     * 转换 Response
     * @param callback
     * @returns
     */
    toResponseJSON(callback?: (data: {
        [path: string]: any;
    }) => void): this;
    /**
     * 转换成ts声明文件
     * @param callback
     * @returns
     */
    toTypeScript(callback?: (data: ResponseCallback) => void): this;
    /**
     * 转换成ts的接口模板
     */
    toInterfaceTemp(callback?: (data: InterfaceTempCallback) => void): this;
    /**
     * 生成模拟的json文件
     */
    buildMockJSON(options: BuildMockOption): this;
    /**
     *
     * @returns 生成api文件
     */
    buildApi(options: BuildApiOption): this;
}
