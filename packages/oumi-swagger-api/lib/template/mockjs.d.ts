export declare const getMockHeaderTemp: (fileType: 'js' | 'ts') => "const Mock = require('mockjs'); \n\n\n\nmodule.exports =  { \n" | "import type { Request, Response } from 'express';\nimport Mock from 'mockjs'; \n\n\n\nexport default { \n";
export declare const mockExportFooterTemp = "}";
export declare const buildMockStr: (data: any) => string | boolean | number;
export default function mockTemp(apiPath: string, methods: string, response: any, options: any): string;
