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
  .query({path: 'activity'})
  .toResponseJSON()
  .toTypeScript()
  .toInterfaceTemp()
```

## params参数
`type: string | object` 

`string`: swagger的http地址；

`object`: swagger的json数据；


## 方法

### query
模糊匹配api，参数：
+ path 【api路径】
+ tag 【版本号】
+ keyword 【api接口描述关键字】


### toResponseJSON
根据查询结果转换成模拟数据。
```js
.toResponseJSON(callbcak?: function);
```
回调函数的参数类型：
+ [path: string] any
```js
toResponseJSON((data)=>{
  /**
   * { 
     '/api/activity': {
        code: '200',
        data: {
          ...
        },
        success: true
   *  }
   * }
   * /
})
```


### toTypeScript
根据查询结果转换成`typescript`的数据类型结构。
```js
.toTypeScript(callbcak?: function);
```
回调函数的参数类型：
+ [path: string] {request: any; response: any;}
```js
toResponseJSON((data)=>{
  /**
   * { 
     '/api/activity': {
        request: {
          props: {}
        };
        response: {
          result: {}
        };
   *  }
   * }
   * /
})
```


### toInterfaceTemp
将上一步的数据结构，转换成`typescript`字符串模板，可以在这的回调生成API的`.d.ts`文件。
```js
.toInterfaceTemp(callbcak?: function);
```
回调函数的参数类型：
+ propsString: string;
+ resultString: string;
```js
toInterfaceTemp((data)=>{
  /** data = 
   * { [path]: {
      propsString: string;
      resultString: string;
      methods: string
    }
   * }
   * /
})
```


### buildMock
生成模拟数据
+ distPath: string;
+ fileType?: dir | hump;
+ filterPathPrefix?: string

distPath（必填）生成的路径。
```js
.buildMock({distPath: path.resolve('./dist/mock')}
```

fileType 生成的文件类型
> dir 类型是目录

> hump 生成驼峰命令类型

filterPathPrefix 过滤路径前缀，
假设swagger的路径是 `oms/api/order/get`，我只需要 `order/get`，就可以这样写：
```js
.buildMock({filterPathPrefix: 'api'}}
```


### buildApi
生成api文件。

+ distPath: string;
+ apiContent: string;
+ fileType?: js | ts;
+ filterPathPrefix?: string

参数`distPath` `filterPathPrefix`同 `buildMock`。

fileType 生成是js或ts类型的api文件。

apiContent 是自定义生成的api内容，示例:
```js
.buildApi({ apiContent: 'export default axios.{methods}({url})' })
```
那么导出的文件就是这样的：
```js
export default axios.post('order/get')
```


提示：以上两个生成文件的方法，都可以通过最上面方法的 `callback` 实现。