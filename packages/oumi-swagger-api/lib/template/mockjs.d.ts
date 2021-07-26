export declare const mockExportHeaderTemp = "\nimport type { Request, Response } from 'express';\nimport Mock from 'mockjs'; \n\n\n\nexport default { \n";
export declare const mockExportFooterTemp = "}";
export declare const buildMockStr: (data: any) => string | boolean | number;
export default function mockTemp(apiPath: string, methods: string, response: any): string;
