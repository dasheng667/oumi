declare type AppVersion = string;

declare namespace SwaggerApi {
  type Result = {
    description: string;
    methods: 'post' | 'get';
    request: Record<string, any>;
    response: Record<string, any>;
  };
}
