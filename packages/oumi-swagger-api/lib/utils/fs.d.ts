/**
 * 创建文件
 * @param filePath
 * @param callback
 */
export declare const createFileSync: (filePath: string, callback?: (err: any, data: any) => void) => void;
export declare function writeJSON(filePath: string, data: any, callback?: (err: any, data: any) => void): void;
export declare function writeFile(filePath: string, content: string, options?: {
    allowRepeat: boolean;
}): void;
