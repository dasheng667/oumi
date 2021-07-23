# @oumi/swagger-api
swagger接口拉取工具，可以生产json模拟数据和typescript声明文件。

## 安装
```
npm install @oumi/swagger-api

yarn add @oumi/swagger-api
```

## 示例
```js
import Swagger from '@oumi/swagger-api';
const swagger = new Swagger(params);

swagger()
  .query({path: 'api/get', tag: 'V1.0.0'})
  .toResponseJSON()
  .toTypeScript()
  .toInterfaceTemp()
```

## params参数
`type: string | object` 

`string`：swagger的http地址；

`object`：swagger的json数据；


## 方法

### query
模糊匹配api，参数：
+ path: `type: string | string[]`  【api路径】
+ tag: `string` 【版本号】
+ keyword: `string` 【api接口描述关键字】


### toResponseJSON
根据查询结果转换成模拟数据。
```js
.toResponseJSON(callbcak?: function);
```
回调函数的参数类型：
+ [path: string] any


### toTypeScript
根据查询结果转换成`typescript`的数据类型结构。
```js
.toTypeScript(callbcak?: function);
```
回调函数的参数类型：
+ [path: string] {request: any; response: any;}


### toInterfaceTemp
将上一步的数据结构，转换成`typescript`字符串模板，可以在这的回调生成API的`.d.ts`文件。
```js
.toInterfaceTemp(callback?: function);
```
> 注意：该方法是生成ts文件，每个文件开始时都会清空，所以 callback 回调会调用多次。

回调函数的参数类型：
+ propsString: string;
+ resultString: string;



### buildMockJSON
生成模拟数据
+ outputPath: string; 【（必填）输出本地路径。】
+ fileType?: dir | hump;  【生成的文件类型。dir表示多目录结构，hump表示驼峰命名结构】
+ filterPathPrefix?: string  【过滤路径前缀】


filterPathPrefix：`filterPathPrefix` 过滤路径前缀，
假设swagger的路径是 `oms/api/order/get`，我只需要 `order/get`，就可以这样写：
```js
.buildMockJSON({filterPathPrefix: 'api'}}
```

生成代码如下：
```json
// response.json
{
	"addTime": "string",
	"myList": [
		{
			"key": "string"
		}
	],
}
```


### buildApi
生成api文件。

+ outputPath: string;  【输出本地路径】
+ requestLibPath: string;  【自定义生成的api头部】
+ fileType?: js | ts;  【生成是js或ts类型的api文件。】
+ filterPathPrefix?: string  【过滤的api前缀】
+ outputFileType?: 'merge' | undefined
+ outputFileName?: string

requestLibPath 示例:
```js
.buildApi({ requestLibPath: "import request from '@/api/request';" })
```

outputFileType：`outputFileType` 输出的文件类型，merge 表示多个文件合并在一起，每个接口都有自己独立的命名空间。

outputFileName：`outputFileName` 若是合并输出则需要申明输出的文件名，默认`serve.ts`。


生成代码如下：
```js
// serve.ts
import request from '@/api/request';  
export type Props = { 
  /** 备注：请求id  */ 
 requestId?: number; 
} 
export type Result = { 
  /** 备注：添加时间  */ 
 data: string[]; 
} 
export default (params: Props, options?: {[key: string]: any}) => {
  return request<Result>({
    url: '/api/getList',
    methods: 'GET',
    data: params,
    ...(options || {})
  })
} 

```




### buildMockJS
生成mockjs的模拟文件。

+ distPath: string;  【输出本地路径】

生成代码如下：
```js
//_mock.ts
import type { Request, Response } from 'express';
import Mock from 'mockjs'; 

export default { 
  "GET /api/getList": function getList(req: Request, res: Response, u: string){
    const data = {
      "addTime": Mock.Random.date('yyyy-MM-dd'),
      "addUserId|1-999": 1,
      "myList|1-10": [
        {
          "key|3-10": "1",
        }
      ],
    };
    return res.send({ code: 200, data, success: true });
  }, 
}
```
