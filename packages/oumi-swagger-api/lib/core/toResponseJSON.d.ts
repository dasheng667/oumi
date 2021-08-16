interface Options {
    /** 生成的response，其值的类型 */
    resultValueType: 'type' | 'desc';
}
/**
 * 模拟数据转response
 * @param data
 * @returns
 */
export default function toResponseJSON(resData: any, options?: Options): {};
export {};
